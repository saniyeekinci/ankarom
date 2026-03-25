import mongoose from "mongoose";

const discountSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Kupon kodu zorunludur"],
      trim: true,
      uppercase: true,
    },
    type: {
      type: String,
      enum: ["percent", "fixed"],
      default: "percent",
    },
    value: {
      type: Number,
      required: [true, "İndirim değeri zorunludur"],
      min: 0,
    },
    usageLimit: {
      type: Number,
      default: 50,
      min: 1,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

discountSchema.index({ code: 1 }, { unique: true });

export default mongoose.model("Discount", discountSchema);
