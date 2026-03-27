import imaps from "imap-simple";
import { simpleParser } from "mailparser";
import SupportTicket from "../models/SupportTicket.js";
import AdminNotification from "../models/AdminNotification.js";
import { sendSupportReplyEmail } from "./sendSupportTicketEmail.js";

const decodeQuotedPrintableText = (value) => {
  const input = String(value || "");
  const normalized = input.replace(/=\r?\n/g, "");
  const bytes = [];

  for (let index = 0; index < normalized.length; index += 1) {
    if (normalized[index] === "=" && /^[0-9A-Fa-f]{2}$/.test(normalized.slice(index + 1, index + 3))) {
      bytes.push(parseInt(normalized.slice(index + 1, index + 3), 16));
      index += 2;
    } else {
      bytes.push(normalized.charCodeAt(index));
    }
  }

  return Buffer.from(bytes).toString("utf8");
};

const extractCleanReply = (text) => {
  if (!text) {
    return "";
  }

  const decodedText = decodeQuotedPrintableText(text);
  let normalizedText = decodedText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  const inlineQuoteMarkers = [
    /\bOn\b.+\bwrote:\s*/i,
    /\btarihinde\b.+\byazd[ıi1]:\s*/i,
    /Ankarom\s+Destek\s*<[^>]+>/i,
    /---\s*Original Message\s*---/i,
    /İletilen\s+ileti/i,
    /Bu\s+e-postaya\s+yanıt\s+verirseniz/i,
  ];

  let cutIndex = normalizedText.length;
  for (const marker of inlineQuoteMarkers) {
    const match = marker.exec(normalizedText);
    if (match && typeof match.index === "number" && match.index < cutIndex) {
      cutIndex = match.index;
    }
  }

  if (cutIndex < normalizedText.length) {
    normalizedText = normalizedText.slice(0, cutIndex);
  }

  const lines = normalizedText.split("\n");

  const quoteStartPatterns = [
    /^On\s.+wrote:\s*$/i,
    /^.+tarihinde\s+şunu\s+yazdı:\s*$/i,
    /^From:\s*/i,
    /^Kimden:\s*/i,
    /^Sent:\s*/i,
    /^Gönderme\s+Tarihi:\s*/i,
    /^To:\s*/i,
    /^Kime:\s*/i,
    /^Subject:\s*/i,
    /^Konu:\s*/i,
    /^---+\s*Original Message\s*---+/i,
    /^-+\s*İletilen ileti\s*-+/i,
    /^Bu\s+e-postaya\s+yanıt\s+verirseniz\s*/i,
    /^>+\s*/,
  ];

  const resultLines = [];
  for (const line of lines) {
    const trimmedLine = line.trim();

    if (quoteStartPatterns.some((pattern) => pattern.test(trimmedLine))) {
      break;
    }

    if (/Ankarom\s+Destek\s*<[^>]+>/i.test(trimmedLine)) {
      break;
    }

    resultLines.push(line);
  }

  return resultLines.join("\n").trim().replace(/^Mesaj:\s*/i, "").trim();
};

const parseTicketNoFromSubject = (subject) => {
  const match = String(subject || "").match(/T-\d{4,}/i);
  return match ? match[0].toUpperCase() : null;
};

const isSystemSupportNotificationSubject = (subject) => {
  const normalized = String(subject || "").trim();
  return /^\[[^\]]+\]\s*(Yeni destek talebi|Destek yanıtı)\s*:\s*T-\d{4,}/i.test(normalized);
};

let listenerStarted = false;
const processedMessageKeys = new Set();

const isReplyMail = (parsedMail, subject) => {
  if (parsedMail?.inReplyTo || (parsedMail?.references && String(parsedMail.references).trim())) {
    return true;
  }

  return /^(re|yanıt|cevap|cv)\s*:/i.test(String(subject || "").trim());
};

const buildMessageKey = (parsedMail, fallbackKey) => {
  const messageId = String(parsedMail?.messageId || "").trim();
  if (messageId) {
    return messageId;
  }

  const subject = String(parsedMail?.subject || "").trim();
  const date = parsedMail?.date ? new Date(parsedMail.date).toISOString() : "";
  return `${subject}|${date}|${fallbackKey}`;
};

const listMailboxes = (connection) =>
  new Promise((resolve, reject) => {
    connection.imap.getBoxes((error, boxes) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(boxes || {});
    });
  });

const flattenMailboxNames = (boxes, prefix = "") => {
  const names = [];

  for (const [name, box] of Object.entries(boxes || {})) {
    const delimiter = box?.delimiter || "/";
    const fullName = prefix ? `${prefix}${delimiter}${name}` : name;
    names.push(fullName);

    if (box?.children) {
      names.push(...flattenMailboxNames(box.children, fullName));
    }
  }

  return names;
};

const resolveTargetMailboxes = async (connection) => {
  const configured = String(
    process.env.IMAP_MAILBOXES || "INBOX,[Gmail]/Sent Mail,[Gmail]/Gönderilmiş Postalar"
  )
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  try {
    const boxes = await listMailboxes(connection);
    const available = new Set(flattenMailboxNames(boxes));
    const existing = configured.filter((mailbox) => available.has(mailbox));

    if (existing.length > 0) {
      return existing;
    }

    if (available.has("INBOX")) {
      return ["INBOX"];
    }

    return configured;
  } catch (error) {
    console.warn("IMAP mailbox discovery failed, using configured list.", error?.message || error);
    return configured;
  }
};

export const startImapListener = async () => {
  if (listenerStarted) {
    return;
  }

  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASS;
  const host = process.env.IMAP_HOST;
  const port = Number(process.env.IMAP_PORT || 993);
  const tls = process.env.IMAP_SECURE === "true";
  const intervalMs = Number(process.env.IMAP_CHECK_INTERVAL_MS || 30000);

  if (!user || !password || !host) {
    console.warn("IMAP listener skipped: missing SMTP_USER/SMTP_PASS/IMAP_HOST.");
    return;
  }

  listenerStarted = true;

  try {
    const connection = await imaps.connect({
      imap: {
        user,
        password,
        host,
        port,
        tls,
        authTimeout: 10000,
        tlsOptions: { rejectUnauthorized: false },
      },
    });

    console.log("IMAP listener connected.");

    const processMailbox = async (mailbox) => {
      try {
        await connection.openBox(mailbox, false);

        const sinceDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const searchCriteria = ["ALL", ["SINCE", sinceDate]];

        const messages = await connection.search(searchCriteria, {
          bodies: [""],
          markSeen: mailbox === "INBOX",
        });

        for (const item of messages) {
          const rawPart = item.parts.find((part) => part.which === "");

          if (!rawPart) {
            continue;
          }

          const parsed = await simpleParser(rawPart.body);
          const subject = parsed.subject || "";
          const ticketNo = parseTicketNoFromSubject(subject);

          // Ignore app-generated notification mails so they are not mistaken as human replies.
          if (isSystemSupportNotificationSubject(subject)) {
            continue;
          }

          const messageKey = buildMessageKey(parsed, `${mailbox}-${item.attributes?.uid || "no-uid"}`);
          if (processedMessageKeys.has(messageKey)) {
            continue;
          }
          processedMessageKeys.add(messageKey);

          if (!ticketNo) {
            continue;
          }

          if (!isReplyMail(parsed, subject)) {
            continue;
          }

          const rawText = parsed.text || parsed.html || "";
          const cleanReply = extractCleanReply(rawText);

          if (!cleanReply) {
            continue;
          }

          if (/^(talep\s*no|müşteri|e-posta|konu|mesaj)\s*:/i.test(cleanReply)) {
            continue;
          }

          const ticket = await SupportTicket.findOne({ ticketNo });
          if (!ticket) {
            continue;
          }

          if (String(ticket.adminReply || "").trim() === cleanReply.trim()) {
            continue;
          }

          const previousAdminReply = String(ticket.adminReply || "").trim();
          ticket.adminReply = cleanReply;
          const messages = Array.isArray(ticket.messages) ? [...ticket.messages] : [];
          if (messages.length === 0 && String(ticket.message || "").trim()) {
            messages.push({
              sender: "customer",
              text: String(ticket.message || "").trim(),
              createdAt: ticket.createdAt || new Date(),
            });
          }
          if (messages.length <= 1 && previousAdminReply) {
            messages.push({
              sender: "admin",
              text: previousAdminReply,
              createdAt: ticket.answeredAt || new Date(),
            });
          }
          messages.push({
            sender: "admin",
            text: cleanReply,
            createdAt: new Date(),
          });
          ticket.messages = messages;
          ticket.status = "Yanıtlandı";
          ticket.answeredAt = new Date();
          await ticket.save();

          if (ticket.customerEmail) {
            const siteName = process.env.SITE_NAME || "Ankarom";
            await sendSupportReplyEmail({
              to: ticket.customerEmail,
              siteName,
              ticketNo: ticket.ticketNo,
              subject: ticket.subject,
              replyMessage: cleanReply,
            });

            await AdminNotification.create({
              title: "Destek talebiniz yanıtlandı",
              message: `${ticket.ticketNo} numaralı destek talebinize yanıt verildi.`,
              channel: "site",
              type: "support_reply",
              recipientEmail: String(ticket.customerEmail || "").trim().toLowerCase(),
            });
          }

          console.log(`IMAP reply processed for ticket ${ticketNo}.`);
        }
      } catch (error) {
        console.error(`IMAP polling error (${mailbox}):`, error?.message || error);
      }
    };

    const pollInbox = async () => {
      const mailboxes = await resolveTargetMailboxes(connection);
      for (const mailbox of mailboxes) {
        await processMailbox(mailbox);
      }
    };

    await pollInbox();
    setInterval(pollInbox, intervalMs);
  } catch (error) {
    listenerStarted = false;
    console.error("IMAP connection error:", error?.message || error);
  }
};
