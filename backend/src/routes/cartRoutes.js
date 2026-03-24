import express from "express";
import { getCart, syncCart } from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Bu route altındaki tüm endpoint'ler giriş yapan kullanıcıya özeldir.
router.use(protect);

router.get("/", getCart);
router.post("/sync", syncCart);

export default router;
