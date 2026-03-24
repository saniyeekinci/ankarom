import mongoose from "mongoose";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// POST /api/orders
// Giriş yapan kullanıcının sepetini siparişe dönüştürür.
export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400);
      throw new Error("Sipariş için en az 1 ürün göndermelisiniz.");
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.city || !shippingAddress.district || !shippingAddress.openAddress) {
      res.status(400);
      throw new Error("Teslimat adresi eksik veya hatalı.");
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const rawItem of items) {
      const productId = rawItem.productId;
      const quantity = Number(rawItem.quantity || 0);

      if (!mongoose.Types.ObjectId.isValid(productId)) {
        res.status(400);
        throw new Error("Geçersiz ürün ID gönderildi.");
      }

      if (!quantity || quantity < 1) {
        res.status(400);
        throw new Error("Ürün miktarı en az 1 olmalıdır.");
      }

      const product = await Product.findById(productId);
      if (!product) {
        res.status(404);
        throw new Error("Sepetteki ürünlerden biri bulunamadı.");
      }

      if (product.stock < quantity) {
        res.status(400);
        throw new Error(`${product.name} için yeterli stok yok.`);
      }

      // İndirimli fiyat varsa onu, yoksa normal fiyatı kullan.
      const unitPrice = typeof product.discountPrice === "number" && product.discountPrice >= 0
        ? product.discountPrice
        : product.price;

      totalAmount += unitPrice * quantity;

      orderItems.push({
        product: product._id,
        productName: product.name,
        imageUrl: product.imageUrl || "",
        quantity,
        unitPrice,
      });

      // Sipariş oluşturulurken stoktan düş.
      product.stock -= quantity;
      await product.save();
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      status: "Hazırlanıyor",
    });

    res.status(201).json({
      message: "Sipariş başarıyla oluşturuldu.",
      order,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/my-orders
// Sadece token sahibi kullanıcının siparişlerini getirir.
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.product", "name price discountPrice imageUrl");

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

