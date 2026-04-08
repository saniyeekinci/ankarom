// backend/src/models/Message.js

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Ad soyad zorunludur"],
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
            default: "",
        },
        city: {
            type: String,
            trim: true,
            default: "",
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            default: "",
        },
        subject: {
            type: String,
            trim: true,
            default: "İletişim Formu",
        },
        message: {
            type: String,
            required: [true, "Mesaj zorunludur"],
            trim: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        isForwardedToWhatsApp: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Message", messageSchema);