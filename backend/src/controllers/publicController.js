import DealerApplication from "../models/DealerApplication.js";
import SupportTicket from "../models/SupportTicket.js";
import AdminSetting from "../models/AdminSetting.js";
import { sendSupportTicketEmail } from "../utils/sendSupportTicketEmail.js";

const generateRef = (prefix) => `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;

const createConversationMessage = (sender, text) => ({
  sender,
  text: String(text || "").trim(),
  createdAt: new Date(),
});

const getMainSettings = async () => {
  let settings = await AdminSetting.findOne({ key: "main" });

  if (!settings) {
    settings = await AdminSetting.create({ key: "main" });
  }

  return settings;
};

export const getPublicSettings = async (req, res, next) => {
  try {
    const settings = await getMainSettings();

    return res.status(200).json({
      siteName: settings.siteName,
      supportEmail: settings.supportEmail,
      supportPhone: settings.supportPhone,
      freeShippingThreshold: settings.freeShippingThreshold,
      maintenanceMode: settings.maintenanceMode,
      allowGuestCheckout: settings.allowGuestCheckout,
      homepageAnnouncement: settings.homepageAnnouncement,
      updatedAt: settings.updatedAt,
    });
  } catch (error) {
    return next(error);
  }
};

export const createPublicSupportTicket = async (req, res, next) => {
  try {
    const { customer, customerEmail, subject, priority, message } = req.body;

    if (!customer || !message) {
      res.status(400);
      throw new Error("Ad soyad ve mesaj zorunludur.");
    }

    const parsedPriority = ["Düşük", "Orta", "Yüksek"].includes(priority) ? priority : "Orta";
    const normalizedSubject = String(subject || "Hesabım destek talebi").trim();
    const normalizedCustomerEmail = String(customerEmail || "").trim().toLowerCase();
    const normalizedCustomer = String(customer).trim();
    const normalizedMessage = String(message).trim();

    let ticket = null;
    const canReuseByEmail = Boolean(normalizedCustomerEmail);

    if (canReuseByEmail) {
      ticket = await SupportTicket.findOne({
        customerEmail: normalizedCustomerEmail,
        status: "Açık",
      }).sort({ updatedAt: -1 });

      if (!ticket) {
        ticket = await SupportTicket.findOne({
          customerEmail: normalizedCustomerEmail,
        }).sort({ updatedAt: -1 });
      }
    }

    const isExistingThread = Boolean(ticket);

    if (ticket) {
      const messages = Array.isArray(ticket.messages) ? [...ticket.messages] : [];
      if (messages.length === 0 && String(ticket.message || "").trim()) {
        messages.push(createConversationMessage("customer", ticket.message));
      }
      if (messages.length <= 1 && String(ticket.adminReply || "").trim()) {
        messages.push(createConversationMessage("admin", ticket.adminReply));
      }
      messages.push(createConversationMessage("customer", normalizedMessage));

      ticket.customer = normalizedCustomer;
      ticket.customerEmail = normalizedCustomerEmail;
      ticket.priority = parsedPriority;
      ticket.status = "Açık";
      ticket.answeredAt = null;
      ticket.adminReply = "";
      ticket.subject = ticket.subject || normalizedSubject;
      ticket.message = normalizedMessage;
      ticket.messages = messages;
      await ticket.save();
    } else {
      ticket = await SupportTicket.create({
        ticketNo: generateRef("T"),
        subject: normalizedSubject,
        customer: normalizedCustomer,
        customerEmail: normalizedCustomerEmail,
        messages: [createConversationMessage("customer", normalizedMessage)],
        message: normalizedMessage,
        priority: parsedPriority,
        status: "Açık",
      });
    }

    const settings = await getMainSettings();
    const recipientEmail = process.env.ADMIN_SUPPORT_EMAIL || settings.supportEmail;

    let emailSent = false;
    try {
      const emailResult = await sendSupportTicketEmail({
        to: recipientEmail,
        siteName: settings.siteName || "Ankarom",
        ticketNo: ticket.ticketNo,
        customer: ticket.customer,
        customerEmail: ticket.customerEmail,
        subject: ticket.subject,
        message: normalizedMessage,
        threadMessageId: ticket.supportThreadMessageId || ticket.supportLastMessageId,
      });
      emailSent = Boolean(emailResult?.sent);

      const latestMessageId = String(emailResult?.messageId || "").trim();
      if (latestMessageId) {
        if (!ticket.supportThreadMessageId) {
          ticket.supportThreadMessageId = latestMessageId;
        }
        ticket.supportLastMessageId = latestMessageId;
        await ticket.save();
      }
    } catch (emailError) {
      console.error("Destek talebi e-postası gönderilemedi:", emailError);
    }

    return res.status(201).json({
      message: isExistingThread
        ? "Mesajınız mevcut destek talebinize eklendi. En kısa sürede dönüş yapacağız."
        : "Talebiniz alındı, en kısa sürede dönüş yapacağız.",
      ticket,
      emailSent,
      reusedOpenTicket: isExistingThread,
    });
  } catch (error) {
    return next(error);
  }
};

export const createPublicDealerApplication = async (req, res, next) => {
  try {
    const { companyName, city, contactName } = req.body;

    if (!companyName || !city || !contactName) {
      res.status(400);
      throw new Error("Firma adı, şehir ve yetkili adı zorunludur.");
    }

    const application = await DealerApplication.create({
      applicationNo: generateRef("B"),
      companyName: String(companyName).trim(),
      city: String(city).trim(),
      contactName: String(contactName).trim(),
      status: "Beklemede",
    });

    return res.status(201).json({
      message: "Bayi başvurunuz alınmıştır.",
      application,
    });
  } catch (error) {
    return next(error);
  }
};
