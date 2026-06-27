import mongoose from 'mongoose';

const otpSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: { expires: 300 }, // TTL Index — MongoDB tự xoá document này sau 300 giây (5 phút)
    },
  }
);

const OTP = mongoose.model('OTP', otpSchema);

export default OTP;
