import mongoose from "mongoose";
import Product from "../models/Product.js";
import Review from "../models/Review.js";

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

// GET /api/products/:id/reviews
export const getProductReviews = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Geçersiz ürün ID.");
    }

    const product = await Product.findById(id).select("name");
    if (!product) {
      res.status(404);
      throw new Error("Ürün bulunamadı.");
    }

    const reviews = await Review.find({ productName: product.name, approved: true })
      .sort({ createdAt: -1 })
      .select("customerName comment rating createdAt");

    return res.status(200).json(reviews);
  } catch (error) {
    return next(error);
  }
};

// POST /api/products/:id/reviews
export const createProductReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { customerName, comment, rating } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Geçersiz ürün ID.");
    }

    const product = await Product.findById(id).select("name");
    if (!product) {
      res.status(404);
      throw new Error("Ürün bulunamadı.");
    }

    if (!customerName || !comment) {
      res.status(400);
      throw new Error("Ad soyad ve yorum zorunludur.");
    }

    const parsedRating = Number(rating ?? 5);
    if (Number.isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      res.status(400);
      throw new Error("Puan 1 ile 5 arasında olmalıdır.");
    }

    const review = await Review.create({
      customerName: String(customerName).trim(),
      productName: product.name,
      comment: String(comment).trim(),
      rating: parsedRating,
      approved: false,
    });

    return res.status(201).json({
      message: "Yorumunuz alındı. Onay sonrası yayınlanacaktır.",
      review,
    });
  } catch (error) {
    return next(error);
  }
};

