import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../middleware/errorMiddleware.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Campaign from "../models/Campaign.js";
import Discount from "../models/Discount.js";
import Review from "../models/Review.js";
import SupportTicket from "../models/SupportTicket.js";
import AdminNotification from "../models/AdminNotification.js";
import DealerApplication from "../models/DealerApplication.js";
import { sendSupportReplyEmail } from "../utils/sendSupportTicketEmail.js";
import {
  parsePrice,
  parseDate,
  normalizeFeatures,
  getMainSettings,
  parseBooleanInput,
  generateRef,
} from "../utils/helpers.js";
import {
  EMAIL_REGEX,
  DISCOUNT_TYPES,
  TICKET_STATUSES,
  TICKET_PRIORITIES,
  DEALER_STATUSES,
  NOTIFICATION_CHANNELS,
  NOTIFICATION_TYPES,
} from "../utils/constants.js";

// ==================== DASHBOARD ====================

export const getDashboardStats = asyncHandler(async (_req, res) => {
  const settings = await getMainSettings();
  const lowStockThreshold = Number(settings.lowStockThreshold ?? 10);

  const [totalRevenueAgg, totalSalesAgg, totalUsers, lowStockProducts, monthlySalesAgg, recentProducts] =
      await Promise.all([
        Order.aggregate([{ $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }]),
        Order.aggregate([
          { $unwind: "$items" },
          { $group: { _id: null, totalSales: { $sum: "$items.quantity" } } },
        ]),
        User.countDocuments(),
        Product.countDocuments({ stock: { $lt: lowStockThreshold } }),
        Order.aggregate([
          {
            $group: {
              _id: { month: { $month: "$createdAt" } },
              revenue: { $sum: "$totalAmount" },
              salesCount: { $sum: 1 },
            },
          },
          { $sort: { "_id.month": 1 } },
        ]),
        Product.find().sort({ createdAt: -1 }).limit(8).select("name category price stock imageUrl createdAt"),
      ]);

  const monthLabels = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
  const monthlySales = monthLabels.map((monthLabel, index) => {
    const matched = monthlySalesAgg.find((item) => item._id.month === index + 1);
    return {
      month: monthLabel,
      revenue: matched?.revenue || 0,
      salesCount: matched?.salesCount || 0,
    };
  });

  res.status(200).json({
    totalRevenue: totalRevenueAgg[0]?.totalRevenue || 0,
    totalSales: totalSalesAgg[0]?.totalSales || 0,
    totalUsers,
    lowStockProducts,
    lowStockThreshold,
    monthlySales,
    recentProducts,
  });
});

export const getAdminReports = asyncHandler(async (_req, res) => {
  const [
    totalRevenueAgg,
    totalOrders,
    deliveredOrders,
    canceledOrders,
    totalUsers,
    totalProducts,
    activeCampaigns,
    topProducts,
    statusBreakdown,
    monthlyRevenue,
  ] = await Promise.all([
    Order.aggregate([{ $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }]),
    Order.countDocuments(),
    Order.countDocuments({ status: "Teslim Edildi" }),
    Order.countDocuments({ status: "İptal Edildi" }),
    User.countDocuments(),
    Product.countDocuments(),
    Campaign.countDocuments({ isActive: true }),
    Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productName",
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.unitPrice"] } },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 8 },
    ]),
    Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 }, revenue: { $sum: "$totalAmount" } } },
      { $sort: { count: -1 } },
    ]),
    Order.aggregate([
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          revenue: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]),
  ]);

  const averageOrderValue = totalOrders > 0 ? (totalRevenueAgg[0]?.totalRevenue || 0) / totalOrders : 0;

  res.status(200).json({
    summary: {
      totalRevenue: totalRevenueAgg[0]?.totalRevenue || 0,
      totalOrders,
      deliveredOrders,
      canceledOrders,
      totalUsers,
      totalProducts,
      activeCampaigns,
      averageOrderValue,
    },
    topProducts: topProducts.map((item) => ({
      productName: item._id,
      totalQuantity: item.totalQuantity,
      totalRevenue: item.totalRevenue,
    })),
    statusBreakdown: statusBreakdown.map((item) => ({
      status: item._id,
      count: item.count,
      revenue: item.revenue,
    })),
    monthlyRevenue: monthlyRevenue.map((item) => ({
      year: item._id.year,
      month: item._id.month,
      revenue: item.revenue,
      orderCount: item.orderCount,
    })),
  });
});

// ==================== SETTINGS ====================

export const getAdminSettings = asyncHandler(async (_req, res) => {
  const settings = await getMainSettings();
  res.status(200).json(settings);
});

export const updateAdminSettings = asyncHandler(async (req, res) => {
  const settings = await getMainSettings();
  const {
    siteName,
    supportEmail,
    supportPhone,
    freeShippingThreshold,
    lowStockThreshold,
    maintenanceMode,
    allowGuestCheckout,
    homepageAnnouncement,
  } = req.body;

  if (siteName !== undefined) {
    const normalized = String(siteName).trim();
    if (!normalized) throw new ApiError(400, "Site adı boş olamaz.");
    settings.siteName = normalized;
  }

  if (supportEmail !== undefined) {
    const normalized = String(supportEmail).trim().toLowerCase();
    if (normalized && !EMAIL_REGEX.test(normalized)) {
      throw new ApiError(400, "Geçerli bir destek e-posta adresi giriniz.");
    }
    settings.supportEmail = normalized;
  }

  if (supportPhone !== undefined) {
    const normalized = String(supportPhone).trim();
    if (normalized.length > 30) throw new ApiError(400, "Destek telefon alanı en fazla 30 karakter olabilir.");
    settings.supportPhone = normalized;
  }

  if (freeShippingThreshold !== undefined) {
    const value = Number(freeShippingThreshold);
    if (Number.isNaN(value) || value < 0) throw new ApiError(400, "Geçerli bir ücretsiz kargo limiti giriniz.");
    settings.freeShippingThreshold = value;
  }

  if (lowStockThreshold !== undefined) {
    const value = Number(lowStockThreshold);
    if (Number.isNaN(value) || value < 0) throw new ApiError(400, "Geçerli bir düşük stok limiti giriniz.");
    settings.lowStockThreshold = value;
  }

  if (maintenanceMode !== undefined) {
    settings.maintenanceMode = parseBooleanInput(maintenanceMode, "Bakım modu");
  }

  if (allowGuestCheckout !== undefined) {
    settings.allowGuestCheckout = parseBooleanInput(allowGuestCheckout, "Misafir ödeme");
  }

  if (homepageAnnouncement !== undefined) {
    const normalized = String(homepageAnnouncement).trim();
    if (normalized.length > 200) throw new ApiError(400, "Ana sayfa duyurusu en fazla 200 karakter olabilir.");
    settings.homepageAnnouncement = normalized;
  }

  const updated = await settings.save();
  res.status(200).json({ message: "Ayarlar güncellendi.", settings: updated });
});

// ==================== ORDERS & USERS ====================

export const getAdminOrders = asyncHandler(async (_req, res) => {
  const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .select("user items totalAmount status createdAt");
  res.status(200).json(orders);
});

export const getAdminUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).select("name email role createdAt");
  res.status(200).json(users);
});

export const getLowStockProducts = asyncHandler(async (req, res) => {
  const settings = await getMainSettings();
  const defaultThreshold = Number(settings.lowStockThreshold ?? 10);
  const parsedThreshold = Number(req.query.threshold ?? defaultThreshold);
  const threshold = Number.isNaN(parsedThreshold) || parsedThreshold < 0 ? defaultThreshold : parsedThreshold;

  const products = await Product.find({ stock: { $lt: threshold } })
      .sort({ stock: 1, createdAt: -1 })
      .select("name category price stock imageUrl updatedAt");

  res.status(200).json({ threshold, defaultThreshold, count: products.length, products });
});

// ==================== PRODUCTS ====================

export const getAdminProducts = asyncHandler(async (_req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.status(200).json(products);
});

export const createProduct = asyncHandler(async (req, res) => {
  const { name, price, discountPrice, stock, category, imageUrl, description, deliveryInfo, features } = req.body;

  const parsedPrice = parsePrice(price);
  if (parsedPrice === null || parsedPrice < 0) {
    throw new ApiError(400, "Geçerli bir fiyat giriniz.");
  }

  const hasDiscountPrice = discountPrice !== undefined && discountPrice !== null && String(discountPrice).trim() !== "";
  const parsedDiscountPrice = hasDiscountPrice ? parsePrice(discountPrice) : null;

  if (hasDiscountPrice && (parsedDiscountPrice === null || parsedDiscountPrice < 0)) {
    throw new ApiError(400, "Geçerli bir indirimli fiyat giriniz.");
  }

  if (parsedDiscountPrice !== null && parsedDiscountPrice > parsedPrice) {
    throw new ApiError(400, "İndirimli fiyat, normal fiyattan büyük olamaz.");
  }

  const product = await Product.create({
    name: String(name).trim(),
    description: String(description || "").trim(),
    price: parsedPrice,
    discountPrice: parsedDiscountPrice,
    stock: Number(stock ?? 0) >= 0 ? Number(stock ?? 0) : 0,
    category: String(category || "Genel").trim(),
    imageUrl: String(imageUrl || "").trim(),
    deliveryInfo: String(deliveryInfo || "Stokta Var").trim(),
    features: normalizeFeatures(features),
  });

  res.status(201).json({ message: "Ürün başarıyla eklendi.", product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const existingProduct = await Product.findById(req.params.id);
  if (!existingProduct) throw new ApiError(404, "Ürün bulunamadı.");

  const { name, price, discountPrice, stock, category, imageUrl, description, deliveryInfo, features } = req.body;

  if (name !== undefined) existingProduct.name = String(name).trim();

  if (price !== undefined) {
    const parsedPrice = parsePrice(price);
    if (parsedPrice === null || parsedPrice < 0) throw new ApiError(400, "Geçerli bir fiyat giriniz.");
    existingProduct.price = parsedPrice;
    if (existingProduct.discountPrice !== null && existingProduct.discountPrice > parsedPrice) {
      existingProduct.discountPrice = parsedPrice;
    }
  }

  if (discountPrice !== undefined) {
    const hasDiscountPrice = discountPrice !== null && String(discountPrice).trim() !== "";
    if (!hasDiscountPrice) {
      existingProduct.discountPrice = null;
    } else {
      const parsedDiscountPrice = parsePrice(discountPrice);
      if (parsedDiscountPrice === null || parsedDiscountPrice < 0) {
        throw new ApiError(400, "Geçerli bir indirimli fiyat giriniz.");
      }
      if (parsedDiscountPrice > existingProduct.price) {
        throw new ApiError(400, "İndirimli fiyat, normal fiyattan büyük olamaz.");
      }
      existingProduct.discountPrice = parsedDiscountPrice;
    }
  }

  if (stock !== undefined) {
    const parsedStock = Number(stock);
    if (Number.isNaN(parsedStock) || parsedStock < 0) throw new ApiError(400, "Geçerli bir stok değeri giriniz.");
    existingProduct.stock = parsedStock;
  }

  if (category !== undefined) existingProduct.category = String(category || "Genel").trim();
  if (imageUrl !== undefined) existingProduct.imageUrl = String(imageUrl || "").trim();
  if (description !== undefined) existingProduct.description = String(description || "").trim();
  if (deliveryInfo !== undefined) existingProduct.deliveryInfo = String(deliveryInfo || "Stokta Var").trim();
  if (features !== undefined) existingProduct.features = normalizeFeatures(features);

  const updatedProduct = await existingProduct.save();
  res.status(200).json({ message: "Ürün güncellendi.", product: updatedProduct });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);
  if (!deletedProduct) throw new ApiError(404, "Ürün bulunamadı.");
  res.status(200).json({ message: "Ürün silindi." });
});

// ==================== CAMPAIGNS ====================

export const getAdminCampaigns = asyncHandler(async (_req, res) => {
  const campaigns = await Campaign.find().sort({ createdAt: -1 });
  res.status(200).json(campaigns);
});

export const createAdminCampaign = asyncHandler(async (req, res) => {
  const { title, code, discountType, discountValue, minimumSpend, startsAt, endsAt, isActive } = req.body;

  if (!DISCOUNT_TYPES.includes(discountType || "percent")) {
    throw new ApiError(400, "Geçerli bir indirim tipi giriniz.");
  }

  const parsedDiscountValue = Number(discountValue);
  if (Number.isNaN(parsedDiscountValue) || parsedDiscountValue < 0) {
    throw new ApiError(400, "Geçerli bir indirim değeri giriniz.");
  }

  if ((discountType || "percent") === "percent" && parsedDiscountValue > 100) {
    throw new ApiError(400, "Yüzdesel indirim 100'den büyük olamaz.");
  }

  const parsedMinimumSpend = Number(minimumSpend ?? 0);
  if (Number.isNaN(parsedMinimumSpend) || parsedMinimumSpend < 0) {
    throw new ApiError(400, "Geçerli bir minimum harcama değeri giriniz.");
  }

  const parsedStartsAt = parseDate(startsAt);
  const parsedEndsAt = parseDate(endsAt);

  if (startsAt && !parsedStartsAt) throw new ApiError(400, "Başlangıç tarihi geçersiz.");
  if (endsAt && !parsedEndsAt) throw new ApiError(400, "Bitiş tarihi geçersiz.");
  if (parsedStartsAt && parsedEndsAt && parsedStartsAt > parsedEndsAt) {
    throw new ApiError(400, "Bitiş tarihi başlangıç tarihinden önce olamaz.");
  }

  const campaign = await Campaign.create({
    title: String(title).trim(),
    code: String(code).trim().toUpperCase(),
    discountType: discountType || "percent",
    discountValue: parsedDiscountValue,
    minimumSpend: parsedMinimumSpend,
    startsAt: parsedStartsAt,
    endsAt: parsedEndsAt,
    isActive: typeof isActive === "boolean" ? isActive : true,
  });

  res.status(201).json({ message: "Kampanya oluşturuldu.", campaign });
});

export const updateAdminCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) throw new ApiError(404, "Kampanya bulunamadı.");

  const { title, code, discountType, discountValue, minimumSpend, startsAt, endsAt, isActive } = req.body;

  if (title !== undefined) campaign.title = String(title).trim();
  if (code !== undefined) campaign.code = String(code).trim().toUpperCase();

  if (discountType !== undefined) {
    if (!DISCOUNT_TYPES.includes(discountType)) throw new ApiError(400, "Geçerli bir indirim tipi giriniz.");
    campaign.discountType = discountType;
  }

  if (discountValue !== undefined) {
    const parsedDiscountValue = Number(discountValue);
    if (Number.isNaN(parsedDiscountValue) || parsedDiscountValue < 0) {
      throw new ApiError(400, "Geçerli bir indirim değeri giriniz.");
    }
    campaign.discountValue = parsedDiscountValue;
  }

  if (minimumSpend !== undefined) {
    const parsedMinimumSpend = Number(minimumSpend);
    if (Number.isNaN(parsedMinimumSpend) || parsedMinimumSpend < 0) {
      throw new ApiError(400, "Geçerli bir minimum harcama değeri giriniz.");
    }
    campaign.minimumSpend = parsedMinimumSpend;
  }

  if (startsAt !== undefined) {
    const parsedStartsAt = parseDate(startsAt);
    if (startsAt && !parsedStartsAt) throw new ApiError(400, "Başlangıç tarihi geçersiz.");
    campaign.startsAt = parsedStartsAt;
  }

  if (endsAt !== undefined) {
    const parsedEndsAt = parseDate(endsAt);
    if (endsAt && !parsedEndsAt) throw new ApiError(400, "Bitiş tarihi geçersiz.");
    campaign.endsAt = parsedEndsAt;
  }

  if (campaign.startsAt && campaign.endsAt && campaign.startsAt > campaign.endsAt) {
    throw new ApiError(400, "Bitiş tarihi başlangıç tarihinden önce olamaz.");
  }

  if (campaign.discountType === "percent" && campaign.discountValue > 100) {
    throw new ApiError(400, "Yüzdesel indirim 100'den büyük olamaz.");
  }

  if (isActive !== undefined) campaign.isActive = Boolean(isActive);

  const updatedCampaign = await campaign.save();
  res.status(200).json({ message: "Kampanya güncellendi.", campaign: updatedCampaign });
});

export const deleteAdminCampaign = asyncHandler(async (req, res) => {
  const deletedCampaign = await Campaign.findByIdAndDelete(req.params.id);
  if (!deletedCampaign) throw new ApiError(404, "Kampanya bulunamadı.");
  res.status(200).json({ message: "Kampanya silindi." });
});

// ==================== DISCOUNTS ====================

export const getAdminDiscounts = asyncHandler(async (_req, res) => {
  let discounts = await Discount.find().sort({ createdAt: -1 });

  if (discounts.length === 0) {
    await Discount.create([
      { code: "YAZ2026", type: "percent", value: 10, usageLimit: 200, active: true },
      { code: "HOSGELDIN", type: "fixed", value: 2500, usageLimit: 100, active: true },
    ]);
    discounts = await Discount.find().sort({ createdAt: -1 });
  }

  res.status(200).json(discounts);
});

export const createAdminDiscount = asyncHandler(async (req, res) => {
  const { code, type, value, usageLimit, active } = req.body;

  const normalizedCode = String(code).trim().toUpperCase();
  if (!normalizedCode) throw new ApiError(400, "Kupon kodu boş olamaz.");

  if (!DISCOUNT_TYPES.includes(type || "percent")) {
    throw new ApiError(400, "Geçerli bir indirim tipi giriniz.");
  }

  const parsedValue = Number(value);
  if (Number.isNaN(parsedValue) || parsedValue < 0) {
    throw new ApiError(400, "Geçerli bir indirim değeri giriniz.");
  }

  if ((type || "percent") === "percent" && parsedValue > 100) {
    throw new ApiError(400, "Yüzdesel indirim 100'den büyük olamaz.");
  }

  const parsedUsageLimit = Number(usageLimit ?? 50);
  if (Number.isNaN(parsedUsageLimit) || parsedUsageLimit < 1) {
    throw new ApiError(400, "Kullanım limiti en az 1 olmalıdır.");
  }

  const exists = await Discount.findOne({ code: normalizedCode });
  if (exists) throw new ApiError(400, "Bu kupon kodu zaten mevcut.");

  const discount = await Discount.create({
    code: normalizedCode,
    type: type || "percent",
    value: parsedValue,
    usageLimit: parsedUsageLimit,
    active: typeof active === "boolean" ? active : true,
  });

  res.status(201).json({ message: "Kupon eklendi.", discount });
});

export const toggleAdminDiscount = asyncHandler(async (req, res) => {
  const discount = await Discount.findById(req.params.id);
  if (!discount) throw new ApiError(404, "Kupon bulunamadı.");

  discount.active = !discount.active;
  const updated = await discount.save();
  res.status(200).json({ message: "Kupon durumu güncellendi.", discount: updated });
});

// ==================== REVIEWS ====================

export const getAdminReviews = asyncHandler(async (_req, res) => {
  let reviews = await Review.find().sort({ createdAt: -1 });

  if (reviews.length === 0) {
    await Review.create([
      { customerName: "Mehmet K.", productName: "Tekne Römorku TR-220", comment: "Çok sağlam, teslimat hızlıydı.", rating: 5, approved: true },
      { customerName: "Ayşe T.", productName: "ATV Römorku A-90", comment: "Fiyat iyi, kurulum rehberi daha detaylı olabilir.", rating: 4, approved: false },
    ]);
    reviews = await Review.find().sort({ createdAt: -1 });
  }

  res.status(200).json(reviews);
});

export const toggleAdminReviewApproval = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new ApiError(404, "Yorum bulunamadı.");

  review.approved = !review.approved;
  const updated = await review.save();
  res.status(200).json({ message: "Yorum onay durumu güncellendi.", review: updated });
});

// ==================== SUPPORT TICKETS ====================

export const getAdminSupportTickets = asyncHandler(async (_req, res) => {
  const tickets = await SupportTicket.find().sort({ createdAt: -1 });
  res.status(200).json(tickets);
});

export const createAdminSupportTicket = asyncHandler(async (req, res) => {
  const { subject, customer, customerEmail, message, priority } = req.body;

  const parsedPriority = TICKET_PRIORITIES.includes(priority) ? priority : "Orta";

  const ticket = await SupportTicket.create({
    ticketNo: generateRef("T"),
    subject: String(subject).trim(),
    customer: String(customer).trim(),
    customerEmail: String(customerEmail || "").trim(),
    messages: String(message || "").trim()
        ? [{ sender: "customer", text: String(message || "").trim(), createdAt: new Date() }]
        : [],
    message: String(message || "").trim(),
    priority: parsedPriority,
    status: "Açık",
  });

  res.status(201).json({ message: "Destek talebi eklendi.", ticket });
});

export const updateAdminSupportTicketStatus = asyncHandler(async (req, res) => {
  const { status, replyMessage } = req.body;

  if (!TICKET_STATUSES.includes(status)) {
    throw new ApiError(400, "Geçerli bir durum giriniz.");
  }

  const ticket = await SupportTicket.findById(req.params.id);
  if (!ticket) throw new ApiError(404, "Destek talebi bulunamadı.");

  let emailSent = false;

  if (status === "Yanıtlandı") {
    const normalizedReply = String(replyMessage || "").trim();

    if (normalizedReply) {
      if (!ticket.customerEmail) {
        throw new ApiError(400, "Müşteri e-posta adresi olmadığı için yanıt gönderilemez.");
      }

      const settings = await getMainSettings();
      const replyEmailResult = await sendSupportReplyEmail({
        to: ticket.customerEmail,
        siteName: settings.siteName || "Ankarom",
        ticketNo: ticket.ticketNo,
        subject: ticket.subject,
        replyMessage: normalizedReply,
        threadMessageId: ticket.supportThreadMessageId || ticket.supportLastMessageId,
      });

      if (!replyEmailResult?.sent) {
        const reason = replyEmailResult?.reason ? ` (${replyEmailResult.reason})` : "";
        throw new ApiError(500, `Yanıt e-postası gönderilemedi${reason}.`);
      }

      emailSent = true;
      const previousAdminReply = String(ticket.adminReply || "").trim();
      ticket.adminReply = normalizedReply;

      const messages = Array.isArray(ticket.messages) ? [...ticket.messages] : [];
      if (messages.length === 0 && String(ticket.message || "").trim()) {
        messages.push({ sender: "customer", text: String(ticket.message || "").trim(), createdAt: ticket.createdAt || new Date() });
      }
      if (messages.length <= 1 && previousAdminReply) {
        messages.push({ sender: "admin", text: previousAdminReply, createdAt: ticket.answeredAt || new Date() });
      }
      messages.push({ sender: "admin", text: normalizedReply, createdAt: new Date() });
      ticket.messages = messages;

      const latestMessageId = String(replyEmailResult?.messageId || "").trim();
      if (latestMessageId) {
        if (!ticket.supportThreadMessageId) ticket.supportThreadMessageId = latestMessageId;
        ticket.supportLastMessageId = latestMessageId;
      }
    }

    if (ticket.customerEmail) {
      await AdminNotification.create({
        title: "Destek talebiniz yanıtlandı",
        message: normalizedReply
            ? `${ticket.ticketNo} numaralı destek talebinize yanıt verildi.`
            : `${ticket.ticketNo} numaralı destek talebiniz e-posta üzerinden yanıtlandı.`,
        channel: "site",
        type: "support_reply",
        recipientEmail: String(ticket.customerEmail || "").trim().toLowerCase(),
      });
    }

    ticket.answeredAt = new Date();
  }

  ticket.status = status;
  const updated = await ticket.save();
  res.status(200).json({ message: "Destek talebi durumu güncellendi.", ticket: updated, emailSent });
});

// ==================== NOTIFICATIONS ====================

export const getAdminNotifications = asyncHandler(async (_req, res) => {
  const notifications = await AdminNotification.find().sort({ createdAt: -1 });
  res.status(200).json(notifications);
});

export const createAdminNotification = asyncHandler(async (req, res) => {
  const { title, message, channel, type, recipientEmail } = req.body;

  if (channel && !NOTIFICATION_CHANNELS.includes(channel)) {
    throw new ApiError(400, "Geçerli bir bildirim kanalı seçiniz.");
  }

  if (type && !NOTIFICATION_TYPES.includes(type)) {
    throw new ApiError(400, "Geçerli bir bildirim tipi seçiniz.");
  }

  const notification = await AdminNotification.create({
    title: String(title).trim(),
    message: String(message).trim(),
    channel: channel || "site",
    type: type || "general",
    recipientEmail: String(recipientEmail || "").trim().toLowerCase(),
  });

  res.status(201).json({ message: "Bildirim gönderimi kaydedildi.", notification });
});

// ==================== DEALER APPLICATIONS ====================

export const getAdminDealerApplications = asyncHandler(async (_req, res) => {
  let applications = await DealerApplication.find().sort({ createdAt: -1 });

  if (applications.length === 0) {
    await DealerApplication.create([
      { applicationNo: "B-101", companyName: "Ankara Çekici Market", city: "Ankara", contactName: "Ali Demir", status: "Beklemede" },
      { applicationNo: "B-102", companyName: "Ege Römork", city: "İzmir", contactName: "Esra Kılıç", status: "Beklemede" },
    ]);
    applications = await DealerApplication.find().sort({ createdAt: -1 });
  }

  res.status(200).json(applications);
});

export const createAdminDealerApplication = asyncHandler(async (req, res) => {
  const { companyName, city, contactName } = req.body;

  const application = await DealerApplication.create({
    applicationNo: generateRef("B"),
    companyName: String(companyName).trim(),
    city: String(city).trim(),
    contactName: String(contactName).trim(),
    status: "Beklemede",
  });

  res.status(201).json({ message: "Bayi başvurusu eklendi.", application });
});

export const updateAdminDealerStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!DEALER_STATUSES.includes(status)) {
    throw new ApiError(400, "Geçerli bir başvuru durumu giriniz.");
  }

  const application = await DealerApplication.findById(req.params.id);
  if (!application) throw new ApiError(404, "Bayi başvurusu bulunamadı.");

  application.status = status;
  const updated = await application.save();
  res.status(200).json({ message: "Başvuru durumu güncellendi.", application: updated });
});