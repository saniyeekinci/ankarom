import mongoose from "mongoose";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Campaign from "../models/Campaign.js";
import AdminSetting from "../models/AdminSetting.js";

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

export const getDashboardStats = async (req, res, next) => {
  try {
    const [totalRevenueAgg, totalSalesAgg, totalUsers, lowStockProducts, monthlySalesAgg, recentProducts] = await Promise.all([
      Order.aggregate([{ $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }]),
      Order.aggregate([
        { $unwind: "$items" },
        { $group: { _id: null, totalSales: { $sum: "$items.quantity" } } },
      ]),
      User.countDocuments(),
      Product.countDocuments({ stock: { $lt: 10 } }),
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
      monthlySales,
      recentProducts,
    });
  } catch (error) {
    return next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, price, discountPrice, stock, category, imageUrl, description, deliveryInfo } = req.body;

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

    const { name, price, discountPrice, stock, category, imageUrl, description, deliveryInfo } = req.body;

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
    const threshold = Number(req.query.threshold ?? 10);

    const products = await Product.find({ stock: { $lt: threshold } })
      .sort({ stock: 1, createdAt: -1 })
      .select("name category price stock imageUrl updatedAt");

    return res.status(200).json({
      threshold,
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
    let settings = await AdminSetting.findOne({ key: "main" });

    if (!settings) {
      settings = await AdminSetting.create({ key: "main" });
    }

    return res.status(200).json(settings);
  } catch (error) {
    return next(error);
  }
};

export const updateAdminSettings = async (req, res, next) => {
  try {
    let settings = await AdminSetting.findOne({ key: "main" });

    if (!settings) {
      settings = await AdminSetting.create({ key: "main" });
    }

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
      settings.siteName = String(siteName).trim();
    }

    if (supportEmail !== undefined) {
      settings.supportEmail = String(supportEmail).trim().toLowerCase();
    }

    if (supportPhone !== undefined) {
      settings.supportPhone = String(supportPhone).trim();
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
      settings.maintenanceMode = Boolean(maintenanceMode);
    }

    if (allowGuestCheckout !== undefined) {
      settings.allowGuestCheckout = Boolean(allowGuestCheckout);
    }

    if (homepageAnnouncement !== undefined) {
      settings.homepageAnnouncement = String(homepageAnnouncement).trim();
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
