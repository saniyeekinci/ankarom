import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import publicRoutes from "./src/routes/publicRoutes.js";
import { notFound, errorHandler } from "./src/middleware/errorMiddleware.js";

dotenv.config();


const app = express();

// Güvenlik: HTTP başlıklarını güvenli hale getirir.
app.use(helmet());

// Güvenlik: Çok kısa sürede aşırı istek atılmasını sınırlar (basit DDoS/brute-force önlemi).
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Çok fazla istek gönderildi, lütfen daha sonra tekrar deneyin." },
  })
);

// Frontend'den gelen istekleri kabul eder.
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        process.env.CLIENT_URL,
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
      ].filter(Boolean);

      // Postman/sunucu içi çağrılar gibi origin'siz istekleri engellemeyiz.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS hatası: Bu origin için erişim izni yok."));
    },
    credentials: true,
  })
);

// JSON body okumak için gerekli middleware.
app.use(express.json());

// Basit sağlık kontrol endpoint'i.
app.get("/", (req, res) => {
  res.status(200).json({ message: "Ankarom Backend API çalışıyor." });
});

// API route'ları
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/public", publicRoutes);

// Hata middleware'leri
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server çalışıyor: http://localhost:${PORT}`);
  });
});
