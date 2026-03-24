import mongoose from "mongoose";

const adminSettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "main",
    },
    siteName: {
      type: String,
      default: "Ankarom",
      trim: true,
    },
    supportEmail: {
      type: String,
      default: "destek@ankarom.com",
      trim: true,
      lowercase: true,
    },
    supportPhone: {
      type: String,
      default: "",
      trim: true,
    },
    freeShippingThreshold: {
      type: Number,
      default: 0,
      min: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: 0,
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    allowGuestCheckout: {
      type: Boolean,
      default: true,
    },
    homepageAnnouncement: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("AdminSetting", adminSettingSchema);
