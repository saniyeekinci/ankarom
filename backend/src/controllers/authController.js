import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../middleware/errorMiddleware.js";
import User from "../models/User.js";
import SupportTicket from "../models/SupportTicket.js";
import AdminNotification from "../models/AdminNotification.js";
import generateToken from "../utils/generateToken.js";
import { EMAIL_REGEX } from "../utils/constants.js";
import { escapeRegex } from "../utils/helpers.js";

const formatUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone || "",
  role: user.role,
});

const normalizeTicketMessages = (ticket) => {
  const existing = Array.isArray(ticket.messages)
      ? ticket.messages
          .filter((entry) => entry && String(entry.text || "").trim())
          .map((entry) => ({
            sender: entry.sender,
            text: String(entry.text || "").trim(),
            createdAt: entry.createdAt || ticket.createdAt || new Date(),
          }))
      : [];

  if (existing.length > 0) {
    return existing.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  const fallback = [];
  if (String(ticket.message || "").trim()) {
    fallback.push({
      sender: "customer",
      text: String(ticket.message || "").trim(),
      createdAt: ticket.createdAt || new Date(),
    });
  }

  if (String(ticket.adminReply || "").trim()) {
    fallback.push({
      sender: "admin",
      text: String(ticket.adminReply || "").trim(),
      createdAt: ticket.answeredAt || ticket.updatedAt || new Date(),
    });
  }

  return fallback;
};

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (password.length < 6) {
    throw new ApiError(400, "Şifre en az 6 karakter olmalıdır.");
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(409, "Bu e-posta ile kayıtlı kullanıcı zaten var.");
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: "user",
  });

  const token = generateToken(user._id);

  res.status(201).json({
    message: "Kayıt başarılı.",
    token,
    user: formatUserResponse(user),
  });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Geçersiz e-posta veya şifre.");
  }

  const token = generateToken(user._id);

  res.status(200).json({
    message: "Giriş başarılı.",
    token,
    user: formatUserResponse(user),
  });
});

// POST /api/auth/google
export const googleAuth = asyncHandler(async (req, res) => {
  const { email, name, googleId } = req.body;

  const normalizedEmail = email.toLowerCase();
  let user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    const randomPassword = Math.random().toString(36).slice(-12) + "Aa1!";

    user = await User.create({
      name: name || normalizedEmail.split("@")[0],
      email: normalizedEmail,
      password: randomPassword,
      googleId: googleId || null,
      role: "user",
    });
  } else if (googleId && !user.googleId) {
    user.googleId = googleId;
    await user.save();
  }

  const token = generateToken(user._id);

  res.status(200).json({
    message: "Google girişi başarılı.",
    token,
    user: formatUserResponse(user),
  });
});

// GET /api/auth/me
export const getMyProfile = asyncHandler(async (req, res) => {
  res.status(200).json({ user: formatUserResponse(req.user) });
});

// PUT /api/auth/me
export const updateMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { name, email, phone, currentPassword, newPassword } = req.body;

  if (name !== undefined) {
    const normalizedName = String(name).trim();
    if (!normalizedName) {
      throw new ApiError(400, "Ad soyad boş olamaz.");
    }
    user.name = normalizedName;
  }

  if (email !== undefined) {
    const normalizedEmail = String(email).trim().toLowerCase();
    if (!normalizedEmail || !EMAIL_REGEX.test(normalizedEmail)) {
      throw new ApiError(400, "Geçerli bir e-posta adresi giriniz.");
    }

    const emailOwner = await User.findOne({ email: normalizedEmail });
    if (emailOwner && String(emailOwner._id) !== String(user._id)) {
      throw new ApiError(409, "Bu e-posta başka bir hesapta kullanılıyor.");
    }

    user.email = normalizedEmail;
  }

  if (phone !== undefined) {
    const normalizedPhone = String(phone).trim();
    if (normalizedPhone.length > 30) {
      throw new ApiError(400, "Telefon alanı en fazla 30 karakter olabilir.");
    }
    user.phone = normalizedPhone;
  }

  if (newPassword !== undefined && String(newPassword).trim() !== "") {
    if (!currentPassword) {
      throw new ApiError(400, "Şifre değiştirmek için mevcut şifrenizi girmelisiniz.");
    }

    if (String(newPassword).length < 6) {
      throw new ApiError(400, "Yeni şifre en az 6 karakter olmalıdır.");
    }

    const isPasswordCorrect = await user.comparePassword(String(currentPassword));
    if (!isPasswordCorrect) {
      throw new ApiError(401, "Mevcut şifre hatalı.");
    }

    user.password = String(newPassword);
  }

  await user.save();

  res.status(200).json({
    message: "Hesap ayarları güncellendi.",
    user: formatUserResponse(user),
  });
});

// GET /api/auth/my-support-tickets
export const getMySupportTickets = asyncHandler(async (req, res) => {
  const userEmail = String(req.user?.email || "").trim().toLowerCase();
  const userName = String(req.user?.name || "").trim();

  const orFilters = [];
  if (userEmail) {
    orFilters.push({ customerEmail: userEmail });
  }
  if (userName) {
    orFilters.push({ customer: { $regex: `^${escapeRegex(userName)}$`, $options: "i" } });
  }

  const query = orFilters.length > 0 ? { $or: orFilters } : { _id: null };

  const tickets = await SupportTicket.find(query)
      .sort({ createdAt: -1 })
      .select("ticketNo subject message adminReply messages status createdAt answeredAt updatedAt");

  const payload = tickets.map((ticket) => ({
    ...ticket.toObject(),
    messages: normalizeTicketMessages(ticket.toObject()),
  }));

  res.status(200).json(payload);
});

// GET /api/auth/notifications
export const getMyNotifications = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("notificationReadAt email");
  const userEmail = String(user.email || "").trim().toLowerCase();

  const recipientFilters = [{ recipientEmail: "" }, { recipientEmail: { $exists: false } }];
  if (userEmail) {
    recipientFilters.push({ recipientEmail: userEmail });
  }

  const notifications = await AdminNotification.find({ channel: "site", $or: recipientFilters })
      .sort({ createdAt: -1 })
      .limit(25)
      .select("title message createdAt channel type recipientEmail");

  const readAt = user.notificationReadAt ? new Date(user.notificationReadAt) : null;
  const payload = notifications.map((notification) => {
    const createdAt = notification.createdAt ? new Date(notification.createdAt) : null;
    const isRead = readAt && createdAt ? createdAt <= readAt : false;
    return { ...notification.toObject(), isRead };
  });

  const unreadCount = payload.reduce((count, item) => count + (item.isRead ? 0 : 1), 0);

  res.status(200).json({
    notifications: payload,
    unreadCount,
    notificationReadAt: user.notificationReadAt,
  });
});

// PUT /api/auth/notifications/read-all
export const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.notificationReadAt = new Date();
  await user.save();

  res.status(200).json({
    message: "Bildirimler okundu olarak işaretlendi.",
    notificationReadAt: user.notificationReadAt,
  });
});