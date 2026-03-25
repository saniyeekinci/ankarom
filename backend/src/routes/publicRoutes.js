import express from "express";
import { createPublicDealerApplication, createPublicSupportTicket, getPublicSettings } from "../controllers/publicController.js";

const router = express.Router();

router.get("/settings", getPublicSettings);
router.post("/support-tickets", createPublicSupportTicket);
router.post("/dealer-applications", createPublicDealerApplication);

export default router;
