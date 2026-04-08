import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../middleware/errorMiddleware.js";
import DealerApplication from "../models/DealerApplication.js";
import SupportTicket from "../models/SupportTicket.js";
import Message from "../models/Message.js";
import { sendSupportTicketEmail } from "../utils/sendSupportTicketEmail.js";
import { generateRef, getMainSettings, createConversationMessage } from "../utils/helpers.js";

// GET /api/public/settings
export const getPublicSettings = asyncHandler(async (_req, res) => {
  const settings = await getMainSettings();

  res.status(200).json({
    siteName: settings.siteName,
    supportEmail: settings.supportEmail,
    supportPhone: settings.supportPhone,
    freeShippingThreshold: settings.freeShippingThreshold,
    maintenanceMode: settings.maintenanceMode,
    allowGuestCheckout: settings.allowGuestCheckout,
    homepageAnnouncement: settings.homepageAnnouncement,
    updatedAt: settings.updatedAt,
  });
});

// POST /api/public/contact
export const contactUs = asyncHandler(async (req, res) => {
  const { name, phone, city, email, subject, message } = req.body;

  if (!name || !message) {
    throw new ApiError(400, "Ad soyad ve mesaj alanları zorunludur.");
  }

  // Save message to database
  const newMessage = await Message.create({
    name: String(name).trim(),
    phone: String(phone || "").trim(),
    city: String(city || "").trim(),
    email: String(email || "").trim().toLowerCase(),
    subject: String(subject || "İletişim Formu").trim(),
    message: String(message).trim(),
    isForwardedToWhatsApp: true,
  });

  res.status(200).json({
    success: true,
    message: "Mesajınız başarıyla alındı.",
    data: {
      id: newMessage._id,
      name: newMessage.name,
      city: newMessage.city,
      subject: newMessage.subject,
    },
  });
});

// POST /api/public/support-tickets
export const createPublicSupportTicket = asyncHandler(async (req, res) => {
  // ... existing code ...
  const { customer, customerEmail, subject, priority, message } = req.body;

  const normalizedSubject = String(subject || "Hesabım destek talebi").trim();
  const normalizedCustomerEmail = String(customerEmail || "").trim().toLowerCase();
  const normalizedCustomer = String(customer).trim();
  const normalizedMessage = String(message).trim();
  const parsedPriority = ["Düşük", "Orta", "Yüksek"].includes(priority) ? priority : "Orta";

  let ticket = null;
  let isExistingThread = false;

  if (normalizedCustomerEmail) {
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

  isExistingThread = Boolean(ticket);

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

  res.status(201).json({
    message: isExistingThread
        ? "Mesajınız mevcut destek talebinize eklendi."
        : "Talebiniz alındı, en kısa sürede dönüş yapacağız.",
    ticket,
    emailSent,
    reusedOpenTicket: isExistingThread,
  });
});

// POST /api/public/dealer-applications
export const createPublicDealerApplication = asyncHandler(async (req, res) => {
  const { companyName, city, contactName } = req.body;

  const application = await DealerApplication.create({
    applicationNo: generateRef("B"),
    companyName: String(companyName).trim(),
    city: String(city).trim(),
    contactName: String(contactName).trim(),
    status: "Beklemede",
  });

  res.status(201).json({
    message: "Bayi başvurunuz alınmıştır.",
    application,
  });
});