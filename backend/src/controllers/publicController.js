import DealerApplication from "../models/DealerApplication.js";
import SupportTicket from "../models/SupportTicket.js";
import AdminSetting from "../models/AdminSetting.js";
import { sendSupportTicketEmail } from "../utils/sendSupportTicketEmail.js";

const generateRef = (prefix) => `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;

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
    const normalizedMessage = String(message).trim();

    const ticket = await SupportTicket.create({
      ticketNo: generateRef("T"),
      subject: normalizedSubject,
      customer: String(customer).trim(),
      customerEmail: String(customerEmail || "").trim(),
      message: normalizedMessage,
      priority: parsedPriority,
      status: "Açık",
    });

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
        message: ticket.message,
      });
      emailSent = Boolean(emailResult?.sent);
    } catch (emailError) {
      console.error("Destek talebi e-postası gönderilemedi:", emailError);
    }

    return res.status(201).json({
      message: "Talebiniz alındı, en kısa sürede dönüş yapacağız.",
      ticket,
      emailSent,
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
