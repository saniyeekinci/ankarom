import DealerApplication from "../models/DealerApplication.js";
import SupportTicket from "../models/SupportTicket.js";
import AdminSetting from "../models/AdminSetting.js";

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
    const { customer, subject, priority, message } = req.body;

    if (!customer || !subject) {
      res.status(400);
      throw new Error("Ad soyad ve konu zorunludur.");
    }

    const parsedPriority = ["Düşük", "Orta", "Yüksek"].includes(priority) ? priority : "Orta";
    const normalizedSubject = message ? `${String(subject).trim()} - ${String(message).trim().slice(0, 100)}` : String(subject).trim();

    const ticket = await SupportTicket.create({
      ticketNo: generateRef("T"),
      subject: normalizedSubject,
      customer: String(customer).trim(),
      priority: parsedPriority,
      status: "Açık",
    });

    return res.status(201).json({
      message: "Talebiniz alındı, en kısa sürede dönüş yapacağız.",
      ticket,
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
