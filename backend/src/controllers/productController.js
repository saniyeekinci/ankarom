import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../middleware/errorMiddleware.js";
import Product from "../models/Product.js";
import Review from "../models/Review.js";

// GET /api/products
export const getProducts = asyncHandler(async (_req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.status(200).json(products);
});

// GET /api/products/:id
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Ürün bulunamadı.");
  }

  res.status(200).json(product);
});

// GET /api/products/:id/reviews
export const getProductReviews = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).select("name");

  if (!product) {
    throw new ApiError(404, "Ürün bulunamadı.");
  }

  const reviews = await Review.find({ productName: product.name, approved: true })
      .sort({ createdAt: -1 })
      .select("customerName comment rating createdAt");

  res.status(200).json(reviews);
});

// POST /api/products/:id/reviews
export const createProductReview = asyncHandler(async (req, res) => {
  const { customerName, comment, rating } = req.body;

  if (!customerName || !comment) {
    throw new ApiError(400, "Ad soyad ve yorum zorunludur.");
  }

  const product = await Product.findById(req.params.id).select("name");

  if (!product) {
    throw new ApiError(404, "Ürün bulunamadı.");
  }

  const parsedRating = Number(rating ?? 5);
  if (Number.isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
    throw new ApiError(400, "Puan 1 ile 5 arasında olmalıdır.");
  }

  const review = await Review.create({
    customerName: String(customerName).trim(),
    productName: product.name,
    comment: String(comment).trim(),
    rating: parsedRating,
    approved: false,
  });

  res.status(201).json({
    message: "Yorumunuz alındı. Onay sonrası yayınlanacaktır.",
    review,
  });
});