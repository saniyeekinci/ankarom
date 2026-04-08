import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ApiError } from "./errorMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new ApiError(401, "Yetkisiz erişim: Token bulunamadı.");
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    throw new ApiError(401, "Kullanıcı bulunamadı.");
  }

  req.user = user;
  next();
});

export const admin = (req, _res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Yetkisiz erişim.");
  }

  if (req.user.role !== "admin") {
    throw new ApiError(403, "Bu işlem için admin yetkisi gerekiyor.");
  }

  next();
};