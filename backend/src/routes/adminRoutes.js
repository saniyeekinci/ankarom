import express from "express";
import {
  createAdminCampaign,
  createProduct,
  deleteAdminCampaign,
  deleteProduct,
  getAdminCampaigns,
  getAdminProducts,
  getAdminOrders,
  getAdminReports,
  getAdminSettings,
  getAdminUsers,
  getDashboardStats,
  getLowStockProducts,
  updateAdminSettings,
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
router.post("/campaigns", createAdminCampaign);
router.post("/products", createProduct);
router.put("/settings", updateAdminSettings);
router.put("/campaigns/:id", updateAdminCampaign);
router.put("/products/:id", updateProduct);
router.delete("/campaigns/:id", deleteAdminCampaign);
router.delete("/products/:id", deleteProduct);

export default router;
