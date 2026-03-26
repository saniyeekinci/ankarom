import mongoose from "mongoose";

const adminNotificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Bildirim başlığı zorunludur"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Bildirim metni zorunludur"],
      trim: true,
    },
    channel: {
      type: String,
      enum: ["site", "email", "sms"],
      default: "site",
    },
    type: {
      type: String,
      enum: ["general", "support_reply"],
      default: "general",
    },
    recipientEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("AdminNotification", adminNotificationSchema);
