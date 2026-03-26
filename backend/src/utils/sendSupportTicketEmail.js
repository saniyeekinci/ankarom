import nodemailer from "nodemailer";

const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user,
      pass,
    },
  });
};

export const sendSupportTicketEmail = async ({ to, siteName, ticketNo, customer, customerEmail, subject, message }) => {
  const transporter = createTransporter();

  if (!transporter || !to) {
    return { sent: false, reason: "missing_smtp_or_recipient" };
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    replyTo: process.env.SMTP_USER,
    subject: `[${siteName}] Yeni destek talebi: ${ticketNo}`,
    text: [
      `Talep No: ${ticketNo}`,
      `Müşteri: ${customer}`,
      `E-posta: ${customerEmail || "-"}`,
      `Konu: ${subject}`,
      "",
      "Mesaj:",
      message,
    ].join("\n"),
  });

  return { sent: true };
};

export const sendSupportReplyEmail = async ({ to, siteName, ticketNo, subject, replyMessage }) => {
  const transporter = createTransporter();

  if (!transporter || !to) {
    return { sent: false, reason: "missing_smtp_or_recipient" };
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: `[${siteName}] Destek yanıtı: ${ticketNo}`,
    text: [
      `Talep No: ${ticketNo}`,
      `Konu: ${subject}`,
      "",
      "Destek ekibi yanıtı:",
      replyMessage,
    ].join("\n"),
  });

  return { sent: true };
};
