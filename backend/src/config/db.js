import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB bağlantısı başarılı.");
  } catch (error) {
    console.error("MongoDB bağlantı hatası:", error.message);
    console.error("İpucu: MongoDB servisinin çalıştığını veya .env içindeki MONGO_URI değerinin doğru olduğunu kontrol edin.");
    process.exit(1);
  }
};

export default connectDB;
