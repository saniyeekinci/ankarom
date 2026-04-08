import express from "express";
import {
    getProducts,
    getProductById,
    getProductReviews,
    createProductReview,
} from "../controllers/productController.js";
import { validateObjectId } from "../middleware/validateRequest.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", validateObjectId("id"), getProductById);
router.get("/:id/reviews", validateObjectId("id"), getProductReviews);
router.post("/:id/reviews", validateObjectId("id"), createProductReview);

export default router;