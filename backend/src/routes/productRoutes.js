import express from "express";
import { createProduct, createProductReview, getProductById, getProductReviews, getProducts } from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, admin, createProduct);
router.get("/", getProducts);
router.get("/:id/reviews", getProductReviews);
router.post("/:id/reviews", createProductReview);
router.get("/:id", getProductById);

export default router;
