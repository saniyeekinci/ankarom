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
  },
  { timestamps: true }
);

export default mongoose.model("AdminNotification", adminNotificationSchema);
