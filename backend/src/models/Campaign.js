import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Kampanya başlığı zorunludur"],
      trim: true,
    },
    code: {
      type: String,
      required: [true, "Kampanya kodu zorunludur"],
      trim: true,
      uppercase: true,
    },
    discountType: {
      type: String,
      enum: ["percent", "fixed"],
      default: "percent",
    },
    discountValue: {
      type: Number,
      required: [true, "İndirim değeri zorunludur"],
      min: 0,
    },
    minimumSpend: {
      type: Number,
      default: 0,
      min: 0,
    },
    startsAt: {
      type: Date,
      default: null,
    },
    endsAt: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

campaignSchema.index({ code: 1 }, { unique: true });

export default mongoose.model("Campaign", campaignSchema);
