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
      index: { expires: 300 }, // Expire after 5 minutes (300 seconds)
    },
  }
);

const OTP = mongoose.model('OTP', otpSchema);

export default OTP;
