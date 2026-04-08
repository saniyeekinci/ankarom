import express from "express";
import {
	register,
	login,
	googleAuth,
	getMyProfile,
	updateMyProfile,
	getMySupportTickets,
	getMyNotifications,
	markAllNotificationsAsRead,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequired } from "../middleware/validateRequest.js";

const router = express.Router();

router.post("/register", validateRequired(["name", "email", "password"]), register);
router.post("/login", validateRequired(["email", "password"]), login);
router.post("/google", validateRequired(["email"]), googleAuth);

// Protected routes
router.use(protect);
router.get("/me", getMyProfile);
router.put("/me", updateMyProfile);
router.get("/my-support-tickets", getMySupportTickets);
router.get("/notifications", getMyNotifications);
router.put("/notifications/read-all", markAllNotificationsAsRead);

export default router;