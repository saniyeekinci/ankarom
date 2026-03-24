import mongoose from "mongoose";
import Product from "../models/Product.js";

const toNumberPrice = (value) => {
  const normalized = String(value ?? "")
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const numeric = Number(normalized);
  return Number.isNaN(numeric) ? null : numeric;
};

// POST /api/products
// Sadece admin kullanıcı yeni ürün ekleyebilir.
export const createProduct = async (req, res, next) => {
  try {
    const { name, currentPrice, image, deliveryText, stock, description } = req.body;

    if (!name || !currentPrice) {
      res.status(400);
      throw new Error("Ürün adı ve fiyat zorunludur.");
    }

    const price = toNumberPrice(currentPrice);
    if (price === null || price < 0) {
      res.status(400);
      throw new Error("Geçerli bir fiyat giriniz.");
    }

    const product = await Product.create({
      name: String(name).trim(),
      description: String(description || "").trim(),
      price,
      stock: Number(stock ?? 0) >= 0 ? Number(stock ?? 0) : 0,
      imageUrl: String(image || "").trim(),
      deliveryInfo: String(deliveryText || "Stokta Var").trim(),
    });

    return res.status(201).json({
      message: "Ürün başarıyla eklendi.",
      product,
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/products
export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Geçersiz ürün ID.");
    }

    const product = await Product.findById(id);

    if (!product) {
      res.status(404);
      throw new Error("Ürün bulunamadı.");
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

