import express from "express";
import {
    getPublicSettings,
    createPublicSupportTicket,
    createPublicDealerApplication,
    contactUs,
} from "../controllers/publicController.js";
import { validateRequired } from "../middleware/validateRequest.js";

const router = express.Router();

router.get("/settings", getPublicSettings);
router.post("/contact", validateRequired(["name", "message"]), contactUs);
router.post("/support-tickets", validateRequired(["customer", "message"]), createPublicSupportTicket);
router.post("/dealer-applications", validateRequired(["companyName", "city", "contactName"]), createPublicDealerApplication);

export default router;