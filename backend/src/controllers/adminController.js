import mongoose from "mongoose";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Campaign from "../models/Campaign.js";
import AdminSetting from "../models/AdminSetting.js";
import Discount from "../models/Discount.js";
import Review from "../models/Review.js";
import SupportTicket from "../models/SupportTicket.js";
import AdminNotification from "../models/AdminNotification.js";
import DealerApplication from "../models/DealerApplication.js";
import { sendSupportReplyEmail } from "../utils/sendSupportTicketEmail.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const parsePrice = (value) => {
  const normalized = String(value ?? "")
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const numberValue = Number(normalized);
  return Number.isNaN(numberValue) ? null : numberValue;
};

const parseDate = (value) => {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const normalizeFeatures = (value) => {
  if (value === undefined || value === null) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => String(item ?? "").trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const getMainSettings = async () => {
  let settings = await AdminSetting.findOne({ key: "main" });

  if (!settings) {
    settings = await AdminSetting.create({ key: "main" });
  }

  return settings;
};

const parseBooleanInput = (value, fieldLabel) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    if (value.toLowerCase() === "true") {
      return true;
    }
    if (value.toLowerCase() === "false") {
      return false;
    }
  }

  throw new Error(`${fieldLabel} için geçerli bir boolean değer giriniz.`);
};

const generateRef = (prefix) => `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;

export const getDashboardStats = async (req, res, next) => {
  try {
    const settings = await getMainSettings();
    const lowStockThreshold = Number(settings.lowStockThreshold ?? 10);

    const [totalRevenueAgg, totalSalesAgg, totalUsers, lowStockProducts, monthlySalesAgg, recentProducts] = await Promise.all([
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

    return res.status(200).json({
      totalRevenue: totalRevenueAgg[0]?.totalRevenue || 0,
      totalSales: totalSalesAgg[0]?.totalSales || 0,
      totalUsers,
      lowStockProducts,
      lowStockThreshold,
      monthlySales,
      recentProducts,
    });
  } catch (error) {
    return next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, price, discountPrice, stock, category, imageUrl, description, deliveryInfo, features } = req.body;

    if (!name || price === undefined) {
      res.status(400);
      throw new Error("Ürün adı ve fiyat zorunludur.");
    }

    const parsedPrice = parsePrice(price);
    if (parsedPrice === null || parsedPrice < 0) {
      res.status(400);
      throw new Error("Geçerli bir fiyat giriniz.");
    }

    const hasDiscountPrice = discountPrice !== undefined && discountPrice !== null && String(discountPrice).trim() !== "";
    const parsedDiscountPrice = hasDiscountPrice ? parsePrice(discountPrice) : null;

    if (hasDiscountPrice && (parsedDiscountPrice === null || parsedDiscountPrice < 0)) {
      res.status(400);
      throw new Error("Geçerli bir indirimli fiyat giriniz.");
    }

    if (parsedDiscountPrice !== null && parsedDiscountPrice > parsedPrice) {
      res.status(400);
      throw new Error("İndirimli fiyat, normal fiyattan büyük olamaz.");
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

    return res.status(201).json({
      message: "Ürün başarıyla eklendi.",
      product,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Geçersiz ürün ID.");
    }

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      res.status(404);
      throw new Error("Ürün bulunamadı.");
    }

    const { name, price, discountPrice, stock, category, imageUrl, description, deliveryInfo, features } = req.body;

    if (name !== undefined) {
      existingProduct.name = String(name).trim();
    }

    if (price !== undefined) {
      const parsedPrice = parsePrice(price);
      if (parsedPrice === null || parsedPrice < 0) {
        res.status(400);
        throw new Error("Geçerli bir fiyat giriniz.");
      }
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
          res.status(400);
          throw new Error("Geçerli bir indirimli fiyat giriniz.");
        }

        if (parsedDiscountPrice > existingProduct.price) {
          res.status(400);
          throw new Error("İndirimli fiyat, normal fiyattan büyük olamaz.");
        }

        existingProduct.discountPrice = parsedDiscountPrice;
      }
    }

    if (stock !== undefined) {
      const parsedStock = Number(stock);
      if (Number.isNaN(parsedStock) || parsedStock < 0) {
        res.status(400);
        throw new Error("Geçerli bir stok değeri giriniz.");
      }
      existingProduct.stock = parsedStock;
    }

    if (category !== undefined) {
      existingProduct.category = String(category || "Genel").trim();
    }

    if (imageUrl !== undefined) {
      existingProduct.imageUrl = String(imageUrl || "").trim();
    }

    if (description !== undefined) {
      existingProduct.description = String(description || "").trim();
    }

    if (deliveryInfo !== undefined) {
      existingProduct.deliveryInfo = String(deliveryInfo || "Stokta Var").trim();
    }

    if (features !== undefined) {
      existingProduct.features = normalizeFeatures(features);
    }

    const updatedProduct = await existingProduct.save();

    return res.status(200).json({
      message: "Ürün güncellendi.",
      product: updatedProduct,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Geçersiz ürün ID.");
    }

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      res.status(404);
      throw new Error("Ürün bulunamadı.");
    }

    return res.status(200).json({
      message: "Ürün silindi.",
    });
  } catch (error) {
    return next(error);
  }
};

export const getAdminProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json(products);
  } catch (error) {
    return next(error);
  }
};

export const getAdminOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .select("user items totalAmount status createdAt");

    return res.status(200).json(orders);
  } catch (error) {
    return next(error);
  }
};

export const getAdminUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .select("name email role createdAt");

    return res.status(200).json(users);
  } catch (error) {
    return next(error);
  }
};

export const getLowStockProducts = async (req, res, next) => {
  try {
    const settings = await getMainSettings();
    const defaultThreshold = Number(settings.lowStockThreshold ?? 10);
    const parsedThreshold = Number(req.query.threshold ?? defaultThreshold);
    const threshold = Number.isNaN(parsedThreshold) || parsedThreshold < 0 ? defaultThreshold : parsedThreshold;

    const products = await Product.find({ stock: { $lt: threshold } })
      .sort({ stock: 1, createdAt: -1 })
      .select("name category price stock imageUrl updatedAt");

    return res.status(200).json({
      threshold,
      defaultThreshold,
      count: products.length,
      products,
    });
  } catch (error) {
    return next(error);
  }
};

export const getAdminCampaigns = async (req, res, next) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    return res.status(200).json(campaigns);
  } catch (error) {
    return next(error);
  }
};

export const createAdminCampaign = async (req, res, next) => {
  try {
    const { title, code, discountType, discountValue, minimumSpend, startsAt, endsAt, isActive } = req.body;

    if (!title || !code || discountValue === undefined) {
      res.status(400);
      throw new Error("Kampanya başlığı, kodu ve indirim değeri zorunludur.");
    }

    if (!["percent", "fixed"].includes(discountType || "percent")) {
      res.status(400);
      throw new Error("Geçerli bir indirim tipi giriniz.");
    }

    const parsedDiscountValue = Number(discountValue);
    if (Number.isNaN(parsedDiscountValue) || parsedDiscountValue < 0) {
      res.status(400);
      throw new Error("Geçerli bir indirim değeri giriniz.");
    }

    if ((discountType || "percent") === "percent" && parsedDiscountValue > 100) {
      res.status(400);
      throw new Error("Yüzdesel indirim 100'den büyük olamaz.");
    }

    const parsedMinimumSpend = Number(minimumSpend ?? 0);
    if (Number.isNaN(parsedMinimumSpend) || parsedMinimumSpend < 0) {
      res.status(400);
      throw new Error("Geçerli bir minimum harcama değeri giriniz.");
    }

    const parsedStartsAt = parseDate(startsAt);
    const parsedEndsAt = parseDate(endsAt);

    if (startsAt && !parsedStartsAt) {
      res.status(400);
      throw new Error("Başlangıç tarihi geçersiz.");
    }

    if (endsAt && !parsedEndsAt) {
      res.status(400);
      throw new Error("Bitiş tarihi geçersiz.");
    }

    if (parsedStartsAt && parsedEndsAt && parsedStartsAt > parsedEndsAt) {
      res.status(400);
      throw new Error("Bitiş tarihi başlangıç tarihinden önce olamaz.");
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

    return res.status(201).json({
      message: "Kampanya oluşturuldu.",
      campaign,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateAdminCampaign = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Geçersiz kampanya ID.");
    }

    const campaign = await Campaign.findById(id);
    if (!campaign) {
      res.status(404);
      throw new Error("Kampanya bulunamadı.");
    }

    const { title, code, discountType, discountValue, minimumSpend, startsAt, endsAt, isActive } = req.body;

    if (title !== undefined) {
      campaign.title = String(title).trim();
    }

    if (code !== undefined) {
      campaign.code = String(code).trim().toUpperCase();
    }

    if (discountType !== undefined) {
      if (!["percent", "fixed"].includes(discountType)) {
        res.status(400);
        throw new Error("Geçerli bir indirim tipi giriniz.");
      }
      campaign.discountType = discountType;
    }

    if (discountValue !== undefined) {
      const parsedDiscountValue = Number(discountValue);
      if (Number.isNaN(parsedDiscountValue) || parsedDiscountValue < 0) {
        res.status(400);
        throw new Error("Geçerli bir indirim değeri giriniz.");
      }
      campaign.discountValue = parsedDiscountValue;
    }

    if (minimumSpend !== undefined) {
      const parsedMinimumSpend = Number(minimumSpend);
      if (Number.isNaN(parsedMinimumSpend) || parsedMinimumSpend < 0) {
        res.status(400);
        throw new Error("Geçerli bir minimum harcama değeri giriniz.");
      }
      campaign.minimumSpend = parsedMinimumSpend;
    }

    if (startsAt !== undefined) {
      const parsedStartsAt = parseDate(startsAt);
      if (startsAt && !parsedStartsAt) {
        res.status(400);
        throw new Error("Başlangıç tarihi geçersiz.");
      }
      campaign.startsAt = parsedStartsAt;
    }

    if (endsAt !== undefined) {
      const parsedEndsAt = parseDate(endsAt);
      if (endsAt && !parsedEndsAt) {
        res.status(400);
        throw new Error("Bitiş tarihi geçersiz.");
      }
      campaign.endsAt = parsedEndsAt;
    }

    if (campaign.startsAt && campaign.endsAt && campaign.startsAt > campaign.endsAt) {
      res.status(400);
      throw new Error("Bitiş tarihi başlangıç tarihinden önce olamaz.");
    }

    if (campaign.discountType === "percent" && campaign.discountValue > 100) {
      res.status(400);
      throw new Error("Yüzdesel indirim 100'den büyük olamaz.");
    }

    if (isActive !== undefined) {
      campaign.isActive = Boolean(isActive);
    }

    const updatedCampaign = await campaign.save();

    return res.status(200).json({
      message: "Kampanya güncellendi.",
      campaign: updatedCampaign,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteAdminCampaign = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Geçersiz kampanya ID.");
    }

    const deletedCampaign = await Campaign.findByIdAndDelete(id);
    if (!deletedCampaign) {
      res.status(404);
      throw new Error("Kampanya bulunamadı.");
    }

    return res.status(200).json({
      message: "Kampanya silindi.",
    });
  } catch (error) {
    return next(error);
  }
};

export const getAdminReports = async (req, res, next) => {
  try {
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
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            revenue: { $sum: "$totalAmount" },
          },
        },
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

    return res.status(200).json({
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
  } catch (error) {
    return next(error);
  }
};

export const getAdminSettings = async (req, res, next) => {
  try {
    const settings = await getMainSettings();

    return res.status(200).json(settings);
  } catch (error) {
    return next(error);
  }
};

export const updateAdminSettings = async (req, res, next) => {
  try {
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
      if (!normalized) {
        res.status(400);
        throw new Error("Site adı boş olamaz.");
      }
      settings.siteName = normalized;
    }

    if (supportEmail !== undefined) {
      const normalized = String(supportEmail).trim().toLowerCase();
      if (normalized && !emailRegex.test(normalized)) {
        res.status(400);
        throw new Error("Geçerli bir destek e-posta adresi giriniz.");
      }
      settings.supportEmail = normalized;
    }

    if (supportPhone !== undefined) {
      const normalized = String(supportPhone).trim();
      if (normalized.length > 30) {
        res.status(400);
        throw new Error("Destek telefon alanı en fazla 30 karakter olabilir.");
      }
      settings.supportPhone = normalized;
    }

    if (freeShippingThreshold !== undefined) {
      const value = Number(freeShippingThreshold);
      if (Number.isNaN(value) || value < 0) {
        res.status(400);
        throw new Error("Geçerli bir ücretsiz kargo limiti giriniz.");
      }
      settings.freeShippingThreshold = value;
    }

    if (lowStockThreshold !== undefined) {
      const value = Number(lowStockThreshold);
      if (Number.isNaN(value) || value < 0) {
        res.status(400);
        throw new Error("Geçerli bir düşük stok limiti giriniz.");
      }
      settings.lowStockThreshold = value;
    }

    if (maintenanceMode !== undefined) {
      try {
        settings.maintenanceMode = parseBooleanInput(maintenanceMode, "Bakım modu");
      } catch (parseError) {
        res.status(400);
        throw parseError;
      }
    }

    if (allowGuestCheckout !== undefined) {
      try {
        settings.allowGuestCheckout = parseBooleanInput(allowGuestCheckout, "Misafir ödeme");
      } catch (parseError) {
        res.status(400);
        throw parseError;
      }
    }

    if (homepageAnnouncement !== undefined) {
      const normalized = String(homepageAnnouncement).trim();
      if (normalized.length > 200) {
        res.status(400);
        throw new Error("Ana sayfa duyurusu en fazla 200 karakter olabilir.");
      }
      settings.homepageAnnouncement = normalized;
    }

    const updated = await settings.save();

    return res.status(200).json({
      message: "Ayarlar güncellendi.",
      settings: updated,
    });
  } catch (error) {
    return next(error);
  }
};

export const getAdminDiscounts = async (req, res, next) => {
  try {
    let discounts = await Discount.find().sort({ createdAt: -1 });

    if (discounts.length === 0) {
      await Discount.create([
        { code: "YAZ2026", type: "percent", value: 10, usageLimit: 200, active: true },
        { code: "HOSGELDIN", type: "fixed", value: 2500, usageLimit: 100, active: true },
      ]);
      discounts = await Discount.find().sort({ createdAt: -1 });
    }

    return res.status(200).json(discounts);
  } catch (error) {
    return next(error);
  }
};

export const createAdminDiscount = async (req, res, next) => {
  try {
    const { code, type, value, usageLimit, active } = req.body;

    if (!code || value === undefined) {
      res.status(400);
      throw new Error("Kupon kodu ve indirim değeri zorunludur.");
    }

    const normalizedCode = String(code).trim().toUpperCase();
    if (!normalizedCode) {
      res.status(400);
      throw new Error("Kupon kodu boş olamaz.");
    }

    if (!["percent", "fixed"].includes(type || "percent")) {
      res.status(400);
      throw new Error("Geçerli bir indirim tipi giriniz.");
    }

    const parsedValue = Number(value);
    if (Number.isNaN(parsedValue) || parsedValue < 0) {
      res.status(400);
      throw new Error("Geçerli bir indirim değeri giriniz.");
    }

    if ((type || "percent") === "percent" && parsedValue > 100) {
      res.status(400);
      throw new Error("Yüzdesel indirim 100'den büyük olamaz.");
    }

    const parsedUsageLimit = Number(usageLimit ?? 50);
    if (Number.isNaN(parsedUsageLimit) || parsedUsageLimit < 1) {
      res.status(400);
      throw new Error("Kullanım limiti en az 1 olmalıdır.");
    }

    const exists = await Discount.findOne({ code: normalizedCode });
    if (exists) {
      res.status(400);
      throw new Error("Bu kupon kodu zaten mevcut.");
    }

    const discount = await Discount.create({
      code: normalizedCode,
      type: type || "percent",
      value: parsedValue,
      usageLimit: parsedUsageLimit,
      active: typeof active === "boolean" ? active : true,
    });

    return res.status(201).json({
      message: "Kupon eklendi.",
      discount,
    });
  } catch (error) {
    return next(error);
  }
};

export const toggleAdminDiscount = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Geçersiz kupon ID.");
    }

    const discount = await Discount.findById(id);
    if (!discount) {
      res.status(404);
      throw new Error("Kupon bulunamadı.");
    }

    discount.active = !discount.active;
    const updated = await discount.save();

    return res.status(200).json({
      message: "Kupon durumu güncellendi.",
      discount: updated,
    });
  } catch (error) {
    return next(error);
  }
};

export const getAdminReviews = async (req, res, next) => {
  try {
    let reviews = await Review.find().sort({ createdAt: -1 });

    if (reviews.length === 0) {
      await Review.create([
        {
          customerName: "Mehmet K.",
          productName: "Tekne Römorku TR-220",
          comment: "Çok sağlam, teslimat hızlıydı.",
          rating: 5,
          approved: true,
        },
        {
          customerName: "Ayşe T.",
          productName: "ATV Römorku A-90",
          comment: "Fiyat iyi, kurulum rehberi daha detaylı olabilir.",
          rating: 4,
          approved: false,
        },
      ]);
      reviews = await Review.find().sort({ createdAt: -1 });
    }

    return res.status(200).json(reviews);
  } catch (error) {
    return next(error);
  }
};

export const toggleAdminReviewApproval = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Geçersiz yorum ID.");
    }

    const review = await Review.findById(id);
    if (!review) {
      res.status(404);
      throw new Error("Yorum bulunamadı.");
    }

    review.approved = !review.approved;
    const updated = await review.save();

    return res.status(200).json({
      message: "Yorum onay durumu güncellendi.",
      review: updated,
    });
  } catch (error) {
    return next(error);
  }
};

export const getAdminSupportTickets = async (req, res, next) => {
  try {
    const tickets = await SupportTicket.find().sort({ createdAt: -1 });

    return res.status(200).json(tickets);
  } catch (error) {
    return next(error);
  }
};

export const createAdminSupportTicket = async (req, res, next) => {
  try {
    const { subject, customer, customerEmail, message, priority } = req.body;

    if (!subject || !customer) {
      res.status(400);
      throw new Error("Konu ve müşteri bilgisi zorunludur.");
    }

    const parsedPriority = ["Düşük", "Orta", "Yüksek"].includes(priority) ? priority : "Orta";
    const ticket = await SupportTicket.create({
      ticketNo: generateRef("T"),
      subject: String(subject).trim(),
      customer: String(customer).trim(),
      customerEmail: String(customerEmail || "").trim(),
      message: String(message || "").trim(),
      priority: parsedPriority,
      status: "Açık",
    });

    return res.status(201).json({
      message: "Destek talebi eklendi.",
      ticket,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateAdminSupportTicketStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, replyMessage } = req.body;
    let emailSent = false;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Geçersiz talep ID.");
    }

    if (status !== "Açık" && status !== "Yanıtlandı") {
      res.status(400);
      throw new Error("Geçerli bir durum giriniz.");
    }

    const ticket = await SupportTicket.findById(id);
    if (!ticket) {
      res.status(404);
      throw new Error("Destek talebi bulunamadı.");
    }

    if (status === "Yanıtlandı") {
      const normalizedReply = String(replyMessage || "").trim();

      if (normalizedReply) {
        if (!ticket.customerEmail) {
          res.status(400);
          throw new Error("Müşteri e-posta adresi olmadığı için yanıt gönderilemez.");
        }

        const settings = await getMainSettings();
        const replyEmailResult = await sendSupportReplyEmail({
          to: ticket.customerEmail,
          siteName: settings.siteName || "Ankarom",
          ticketNo: ticket.ticketNo,
          subject: ticket.subject,
          replyMessage: normalizedReply,
        });

        if (!replyEmailResult?.sent) {
          res.status(500);
          const reason = replyEmailResult?.reason ? ` (${replyEmailResult.reason})` : "";
          throw new Error(`Yanıt e-postası gönderilemedi. SMTP ayarlarını kontrol edin${reason}.`);
        }

        emailSent = true;
        ticket.adminReply = normalizedReply;
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

    return res.status(200).json({
      message: "Destek talebi durumu güncellendi.",
      ticket: updated,
      emailSent,
    });
  } catch (error) {
    return next(error);
  }
};

export const getAdminNotifications = async (req, res, next) => {
  try {
    const notifications = await AdminNotification.find().sort({ createdAt: -1 });
    return res.status(200).json(notifications);
  } catch (error) {
    return next(error);
  }
};

export const createAdminNotification = async (req, res, next) => {
  try {
    const { title, message, channel, type, recipientEmail } = req.body;

    if (!title || !message) {
      res.status(400);
      throw new Error("Bildirim başlığı ve metni zorunludur.");
    }

    if (channel && !["site", "email", "sms"].includes(channel)) {
      res.status(400);
      throw new Error("Geçerli bir bildirim kanalı seçiniz.");
    }

    if (type && !["general", "support_reply"].includes(type)) {
      res.status(400);
      throw new Error("Geçerli bir bildirim tipi seçiniz.");
    }

    const notification = await AdminNotification.create({
      title: String(title).trim(),
      message: String(message).trim(),
      channel: channel || "site",
      type: type || "general",
      recipientEmail: String(recipientEmail || "").trim().toLowerCase(),
    });

    return res.status(201).json({
      message: "Bildirim gönderimi kaydedildi.",
      notification,
    });
  } catch (error) {
    return next(error);
  }
};

export const getAdminDealerApplications = async (req, res, next) => {
  try {
    let applications = await DealerApplication.find().sort({ createdAt: -1 });

    if (applications.length === 0) {
      await DealerApplication.create([
        {
          applicationNo: "B-101",
          companyName: "Ankara Çekici Market",
          city: "Ankara",
          contactName: "Ali Demir",
          status: "Beklemede",
        },
        {
          applicationNo: "B-102",
          companyName: "Ege Römork",
          city: "İzmir",
          contactName: "Esra Kılıç",
          status: "Beklemede",
        },
      ]);
      applications = await DealerApplication.find().sort({ createdAt: -1 });
    }

    return res.status(200).json(applications);
  } catch (error) {
    return next(error);
  }
};

export const createAdminDealerApplication = async (req, res, next) => {
  try {
    const { companyName, city, contactName } = req.body;

    if (!companyName || !city || !contactName) {
      res.status(400);
      throw new Error("Firma, şehir ve yetkili alanları zorunludur.");
    }

    const application = await DealerApplication.create({
      applicationNo: generateRef("B"),
      companyName: String(companyName).trim(),
      city: String(city).trim(),
      contactName: String(contactName).trim(),
      status: "Beklemede",
    });

    return res.status(201).json({
      message: "Bayi başvurusu eklendi.",
      application,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateAdminDealerStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Geçersiz başvuru ID.");
    }

    if (!["Beklemede", "Onaylandı", "Reddedildi"].includes(status)) {
      res.status(400);
      throw new Error("Geçerli bir başvuru durumu giriniz.");
    }

    const application = await DealerApplication.findById(id);
    if (!application) {
      res.status(404);
      throw new Error("Bayi başvurusu bulunamadı.");
    }

    application.status = status;
    const updated = await application.save();

    return res.status(200).json({
      message: "Başvuru durumu güncellendi.",
      application: updated,
    });
  } catch (error) {
    return next(error);
  }
};
