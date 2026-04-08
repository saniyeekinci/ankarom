import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

dotenv.config();

import connectDB from "./src/config/db.js";
import productRoutes from "./src/routes/productRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import publicRoutes from "./src/routes/publicRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import { startImapListener } from "./src/utils/imapListener.js";
import { notFound, errorHandler } from "./src/middleware/errorMiddleware.js";

const app = express();

// Security: Secure HTTP headers
app.use(helmet());

// Security: Rate limiting (DDoS/brute-force protection)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Çok fazla istek gönderildi, lütfen daha sonra tekrar deneyin." },
});
app.use(limiter);

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
].filter(Boolean);

app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error("CORS hatası: Bu origin için erişim izni yok."));
      },
      credentials: true,
    })
);

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint
app.get("/", (_req, res) => {
  res.status(200).json({ success: true, message: "Ankarom Backend API çalışıyor." });
});

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/public", publicRoutes);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Server startup
const PORT = process.env.PORT || 10000;

const startServer = async () => {
  try {
    await connectDB();
    startImapListener();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server ${PORT} portunda çalışıyor (${process.env.NODE_ENV || "development"})`);
    });
  } catch (error) {
    console.error("❌ Server başlatılamadı:", error.message);
    process.exit(1);
  }
};

startServer();