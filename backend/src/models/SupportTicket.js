import mongoose from "mongoose";

const supportTicketSchema = new mongoose.Schema(
  {
    ticketNo: {
      type: String,
      required: [true, "Talep numarası zorunludur"],
      trim: true,
      uppercase: true,
    },
    subject: {
      type: String,
      required: [true, "Konu zorunludur"],
      trim: true,
    },
    customer: {
      type: String,
      required: [true, "Müşteri adı zorunludur"],
      trim: true,
    },
    priority: {
      type: String,
      enum: ["Düşük", "Orta", "Yüksek"],
      default: "Orta",
    },
    status: {
      type: String,
      enum: ["Açık", "Yanıtlandı"],
      default: "Açık",
    },
  },
  { timestamps: true }
);

supportTicketSchema.index({ ticketNo: 1 }, { unique: true });

export default mongoose.model("SupportTicket", supportTicketSchema);
