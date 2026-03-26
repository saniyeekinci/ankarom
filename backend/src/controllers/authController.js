import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import SupportTicket from "../models/SupportTicket.js";
import AdminNotification from "../models/AdminNotification.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("İsim, e-posta ve şifre zorunludur.");
    }

    if (password.length < 6) {
      res.status(400);
      throw new Error("Şifre en az 6 karakter olmalıdır.");
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(409);
      throw new Error("Bu e-posta ile kayıtlı kullanıcı zaten var.");
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
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("not allowed to do action")) {
      res.status(500);
      return next(new Error("Veritabanı kullanıcı yetkisi eksik. MongoDB Atlas'ta bu kullanıcıya ankarom veritabanı için readWrite yetkisi verin."));
    }
    next(error);
  }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("E-posta ve şifre zorunludur.");
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      res.status(401);
      throw new Error("Geçersiz e-posta veya şifre.");
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      res.status(401);
      throw new Error("Geçersiz e-posta veya şifre.");
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Giriş başarılı.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/google
// Frontend'den gelen email/name/googleId ile kullanıcı bulunur, yoksa oluşturulur.
export const googleAuth = async (req, res, next) => {
  try {
    const { email, name, googleId } = req.body;

    if (!email) {
      res.status(400);
      throw new Error("Google giriş için e-posta zorunludur.");
    }

    const normalizedEmail = email.toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // Google ile ilk girişte sistemin istediği "password" alanını
      // doldurmak için rastgele bir değer veriyoruz. Kullanıcı bunu kullanmaz.
      const randomPassword = Math.random().toString(36).slice(-12) + "Aa1!";

      user = await User.create({
        name: name || normalizedEmail.split("@")[0],
        email: normalizedEmail,
        password: randomPassword,
        googleId: googleId || null,
        role: "user",
      });
    } else if (googleId && !user.googleId) {
      // Kullanıcı daha önce normal kayıt olduysa, ilk Google girişinde bağlarız.
      user.googleId = googleId;
      await user.save();
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Google girişi başarılı.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
export const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      res.status(404);
      throw new Error("Kullanıcı bulunamadı.");
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/auth/me
export const updateMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("Kullanıcı bulunamadı.");
    }

    const { name, email, phone, currentPassword, newPassword } = req.body;

    if (name !== undefined) {
      const normalizedName = String(name).trim();
      if (!normalizedName) {
        res.status(400);
        throw new Error("Ad soyad boş olamaz.");
      }
      user.name = normalizedName;
    }

    if (email !== undefined) {
      const normalizedEmail = String(email).trim().toLowerCase();
      if (!normalizedEmail || !emailRegex.test(normalizedEmail)) {
        res.status(400);
        throw new Error("Geçerli bir e-posta adresi giriniz.");
      }

      const emailOwner = await User.findOne({ email: normalizedEmail });
      if (emailOwner && String(emailOwner._id) !== String(user._id)) {
        res.status(409);
        throw new Error("Bu e-posta başka bir hesapta kullanılıyor.");
      }

      user.email = normalizedEmail;
    }

    if (phone !== undefined) {
      const normalizedPhone = String(phone).trim();
      if (normalizedPhone.length > 30) {
        res.status(400);
        throw new Error("Telefon alanı en fazla 30 karakter olabilir.");
      }
      user.phone = normalizedPhone;
    }

    if (newPassword !== undefined && String(newPassword).trim() !== "") {
      const parsedNewPassword = String(newPassword);

      if (!currentPassword) {
        res.status(400);
        throw new Error("Şifre değiştirmek için mevcut şifrenizi girmelisiniz.");
      }

      if (parsedNewPassword.length < 6) {
        res.status(400);
        throw new Error("Yeni şifre en az 6 karakter olmalıdır.");
      }

      const isPasswordCorrect = await user.comparePassword(String(currentPassword));
      if (!isPasswordCorrect) {
        res.status(401);
        throw new Error("Mevcut şifre hatalı.");
      }

      user.password = parsedNewPassword;
    }

    await user.save();

    res.status(200).json({
      message: "Hesap ayarları güncellendi.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/my-support-tickets
export const getMySupportTickets = async (req, res, next) => {
  try {
    const userEmail = String(req.user?.email || "").trim().toLowerCase();
    const userName = String(req.user?.name || "").trim();

    const query = userEmail
      ? { $or: [{ customerEmail: userEmail }, { customer: userName }] }
      : { customer: userName };

    const tickets = await SupportTicket.find(query)
      .sort({ createdAt: -1 })
      .select("ticketNo subject message adminReply status createdAt answeredAt");

    res.status(200).json(tickets);
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/notifications
export const getMyNotifications = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("notificationReadAt email");

    if (!user) {
      res.status(404);
      throw new Error("Kullanıcı bulunamadı.");
    }

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

      return {
        ...notification.toObject(),
        isRead,
      };
    });

    const unreadCount = payload.reduce((count, item) => count + (item.isRead ? 0 : 1), 0);

    res.status(200).json({
      notifications: payload,
      unreadCount,
      notificationReadAt: user.notificationReadAt,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/auth/notifications/read-all
export const markAllNotificationsAsRead = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("Kullanıcı bulunamadı.");
    }

    user.notificationReadAt = new Date();
    await user.save();

    res.status(200).json({
      message: "Bildirimler okundu olarak işaretlendi.",
      notificationReadAt: user.notificationReadAt,
    });
  } catch (error) {
    next(error);
  }
};

