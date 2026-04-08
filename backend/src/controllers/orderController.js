import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../middleware/errorMiddleware.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// POST /api/orders
export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "Sipariş için en az 1 ürün göndermelisiniz.");
  }

  const requiredFields = ["fullName", "phone", "city", "district", "openAddress"];
  const missingFields = requiredFields.filter((f) => !shippingAddress?.[f]);
  if (missingFields.length > 0) {
    throw new ApiError(400, `Teslimat adresi eksik: ${missingFields.join(", ")}`);
  }

  const orderItems = [];
  let totalAmount = 0;

  for (const rawItem of items) {
    const { productId, quantity: rawQuantity } = rawItem;
    const quantity = Number(rawQuantity || 0);

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, "Geçersiz ürün ID gönderildi.");
    }

    if (quantity < 1) {
      throw new ApiError(400, "Ürün miktarı en az 1 olmalıdır.");
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, "Sepetteki ürünlerden biri bulunamadı.");
    }

    if (product.stock < quantity) {
      throw new ApiError(400, `${product.name} için yeterli stok yok.`);
    }

    const unitPrice =
        typeof product.discountPrice === "number" && product.discountPrice >= 0
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
});

// GET /api/orders/my-orders
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.product", "name price discountPrice imageUrl");

  res.status(200).json(orders);
});