import mongoose from "mongoose";

const dealerApplicationSchema = new mongoose.Schema(
  {
    applicationNo: {
      type: String,
      required: [true, "Başvuru numarası zorunludur"],
      trim: true,
      uppercase: true,
    },
    companyName: {
      type: String,
      required: [true, "Firma adı zorunludur"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "Şehir zorunludur"],
      trim: true,
    },
    contactName: {
      type: String,
      required: [true, "Yetkili adı zorunludur"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Beklemede", "Onaylandı", "Reddedildi"],
      default: "Beklemede",
    },
  },
  { timestamps: true }
);

dealerApplicationSchema.index({ applicationNo: 1 }, { unique: true });

export default mongoose.model("DealerApplication", dealerApplicationSchema);
