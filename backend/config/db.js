import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);   // Nếu kết nối DB lỗi -> tắt cả server luôn, vì chạy mà không có DB thì vô nghĩa
  }
};

export default connectDB;
