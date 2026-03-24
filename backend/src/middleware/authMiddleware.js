import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    // Authorization header'ı: "Bearer <token>" formatında gelir.
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401);
      throw new Error("Yetkisiz erişim: Token bulunamadı.");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Şifre hariç kullanıcıyı req.user içine koyuyoruz.
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      res.status(401);
      throw new Error("Kullanıcı bulunamadı.");
    }

    next();
  } catch (error) {
    res.status(401);
    next(error);
  }
};

export const admin = (req, res, next) => {
  if (!req.user) {
    res.status(401);
    return next(new Error("Yetkisiz erişim."));
  }

  if (req.user.role !== "admin") {
    res.status(403);
    return next(new Error("Bu işlem için admin yetkisi gerekiyor."));
  }

  return next();
};
