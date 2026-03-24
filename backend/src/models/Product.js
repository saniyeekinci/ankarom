import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Ürün adı zorunludur"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    category: {
      type: String,
      default: "Genel",
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Fiyat zorunludur"],
      min: 0,
    },
    discountPrice: {
      type: Number,
      default: null,
      min: 0,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    imageUrl: {
      type: String,
      default: "",
      trim: true,
    },
    deliveryInfo: {
      type: String,
      default: "Stokta Var",
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
