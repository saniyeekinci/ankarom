import express from "express";
import {
  createAdminDealerApplication,
  createAdminDiscount,
  createAdminNotification,
  createAdminSupportTicket,
  createAdminCampaign,
  createProduct,
  deleteAdminCampaign,
  deleteProduct,
  getAdminDealerApplications,
  getAdminDiscounts,
  getAdminNotifications,
  getAdminCampaigns,
  getAdminProducts,
  getAdminOrders,
  getAdminReports,
  getAdminReviews,
  getAdminSettings,
  getAdminSupportTickets,
  getAdminUsers,
  getDashboardStats,
  getLowStockProducts,
  toggleAdminDiscount,
  toggleAdminReviewApproval,
  updateAdminDealerStatus,
  updateAdminSettings,
  updateAdminSupportTicketStatus,
  updateAdminCampaign,
  updateProduct,
} from "../controllers/adminController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, admin);

router.get("/dashboard", getDashboardStats);
router.get("/reports", getAdminReports);
router.get("/settings", getAdminSettings);
router.get("/orders", getAdminOrders);
router.get("/users", getAdminUsers);
router.get("/stock", getLowStockProducts);
router.get("/campaigns", getAdminCampaigns);
router.get("/products", getAdminProducts);
router.get("/discounts", getAdminDiscounts);
router.get("/reviews", getAdminReviews);
router.get("/support-tickets", getAdminSupportTickets);
router.get("/notifications", getAdminNotifications);
router.get("/dealer-applications", getAdminDealerApplications);
router.post("/campaigns", createAdminCampaign);
router.post("/products", createProduct);
router.post("/discounts", createAdminDiscount);
router.post("/support-tickets", createAdminSupportTicket);
router.post("/notifications", createAdminNotification);
router.post("/dealer-applications", createAdminDealerApplication);
router.put("/settings", updateAdminSettings);
router.put("/campaigns/:id", updateAdminCampaign);
router.put("/products/:id", updateProduct);
router.put("/discounts/:id/toggle", toggleAdminDiscount);
router.put("/reviews/:id/toggle", toggleAdminReviewApproval);
router.put("/support-tickets/:id/status", updateAdminSupportTicketStatus);
router.put("/dealer-applications/:id/status", updateAdminDealerStatus);
router.delete("/campaigns/:id", deleteAdminCampaign);
router.delete("/products/:id", deleteProduct);

export default router;
