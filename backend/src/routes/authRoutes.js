import express from "express";
import {
	getMyNotifications,
	getMyProfile,
	getMySupportTickets,
	googleAuth,
	login,
	markAllNotificationsAsRead,
	register,
	updateMyProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);
router.get("/me", protect, getMyProfile);
router.get("/my-support-tickets", protect, getMySupportTickets);
router.get("/notifications", protect, getMyNotifications);
router.put("/notifications/read-all", protect, markAllNotificationsAsRead);
router.put("/me", protect, updateMyProfile);

export default router;
