import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, "Müşteri adı zorunludur"],
      trim: true,
    },
    productName: {
      type: String,
      required: [true, "Ürün adı zorunludur"],
      trim: true,
    },
    comment: {
      type: String,
      required: [true, "Yorum metni zorunludur"],
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    approved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
