import express from "express";
import { getMyProfile, login, googleAuth, register, updateMyProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);

export default router;
