import mongoose from "mongoose";
import bcrypt from "bcrypt";

const addressSchema = new mongoose.Schema(
  {
    // Adres etiketi (Ev, İş, Depo vb.)
    title: { type: String, trim: true },
    fullName: { type: String, trim: true },
    phone: { type: String, trim: true },
    city: { type: String, trim: true },
    district: { type: String, trim: true },
    openAddress: { type: String, trim: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "İsim zorunludur"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "E-posta zorunludur"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    // Normal kayıtlı kullanıcılar için şifre alanı zorunlu.
    // Google ile girişte şifre otomatik üretilip hashlenebilir.
    password: {
      type: String,
      required: [true, "Şifre zorunludur"],
      minlength: 6,
    },
    // Google OAuth ile eşleşen kullanıcı ID'si (opsiyonel)
    googleId: {
      type: String,
      default: null,
      index: true,
    },
    addresses: {
      type: [addressSchema],
      default: [],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    notificationReadAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Şifre değiştiyse kayıt öncesi hashler.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Girişte düz metin şifreyi hash ile karşılaştırmak için yardımcı metod.
userSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

export default mongoose.model("User", userSchema);
