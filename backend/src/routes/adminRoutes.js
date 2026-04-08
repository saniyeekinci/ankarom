import express from "express";
import {
  getDashboardStats,
  getAdminReports,
  getAdminSettings,
  updateAdminSettings,
  getAdminOrders,
  getAdminUsers,
  getLowStockProducts,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminCampaigns,
  createAdminCampaign,
  updateAdminCampaign,
  deleteAdminCampaign,
  getAdminDiscounts,
  createAdminDiscount,
  toggleAdminDiscount,
  getAdminReviews,
  toggleAdminReviewApproval,
  getAdminSupportTickets,
  createAdminSupportTicket,
  updateAdminSupportTicketStatus,
  getAdminNotifications,
  createAdminNotification,
  getAdminDealerApplications,
  createAdminDealerApplication,
  updateAdminDealerStatus,
} from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { validateObjectId, validateRequired } from "../middleware/validateRequest.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect, admin);

// Dashboard & Reports
router.get("/dashboard", getDashboardStats);
router.get("/reports", getAdminReports);

// Settings
router.get("/settings", getAdminSettings);
router.put("/settings", updateAdminSettings);

// Orders & Users
router.get("/orders", getAdminOrders);
router.get("/users", getAdminUsers);
router.get("/stock", getLowStockProducts);

// Products
router.get("/products", getAdminProducts);
router.post("/products", validateRequired(["name", "price"]), createProduct);
router.put("/products/:id", validateObjectId("id"), updateProduct);
router.delete("/products/:id", validateObjectId("id"), deleteProduct);

// Campaigns
router.get("/campaigns", getAdminCampaigns);
router.post("/campaigns", validateRequired(["title", "code", "discountValue"]), createAdminCampaign);
router.put("/campaigns/:id", validateObjectId("id"), updateAdminCampaign);
router.delete("/campaigns/:id", validateObjectId("id"), deleteAdminCampaign);

// Discounts
router.get("/discounts", getAdminDiscounts);
router.post("/discounts", validateRequired(["code", "value"]), createAdminDiscount);
router.put("/discounts/:id/toggle", validateObjectId("id"), toggleAdminDiscount);

// Reviews
router.get("/reviews", getAdminReviews);
router.put("/reviews/:id/toggle", validateObjectId("id"), toggleAdminReviewApproval);

// Support Tickets
router.get("/support-tickets", getAdminSupportTickets);
router.post("/support-tickets", validateRequired(["subject", "customer"]), createAdminSupportTicket);
router.put("/support-tickets/:id/status", validateObjectId("id"), validateRequired(["status"]), updateAdminSupportTicketStatus);

// Notifications
router.get("/notifications", getAdminNotifications);
router.post("/notifications", validateRequired(["title", "message"]), createAdminNotification);

// Dealer Applications
router.get("/dealer-applications", getAdminDealerApplications);
router.post("/dealer-applications", validateRequired(["companyName", "city", "contactName"]), createAdminDealerApplication);
router.put("/dealer-applications/:id/status", validateObjectId("id"), validateRequired(["status"]), updateAdminDealerStatus);

export default router;