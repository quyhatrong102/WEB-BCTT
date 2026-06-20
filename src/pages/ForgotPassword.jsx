import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { sendOTP, resetPassword } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    const result = await sendOTP(email);
    setLoading(false);
    if (result.success) {
      setSuccessMsg(result.message);
      setStep(2);
    } else {
      setErrorMsg(result.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    const result = await resetPassword(email, otp, newPassword);
    setLoading(false);
    if (result.success) {
      setSuccessMsg(result.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header text-center bg-white"><h4>Quên mật khẩu</h4></div>
            <div className="card-body">
              {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
              {successMsg && <div className="alert alert-success">{successMsg}</div>}
              
              {step === 1 ? (
                <form onSubmit={handleSendOTP}>
                  <div className="mb-3">
                    <label className="form-label">Nhập email đăng ký tài khoản</label>
                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
                  </div>
                  <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? 'Đang gửi mã...' : 'Nhận mã OTP'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword}>
                  <div className="mb-3 text-center">
                    <p>Mã OTP đã được gửi đến <strong>{email}</strong></p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mã OTP</label>
                    <input type="text" className="form-control text-center letter-spacing-5 fs-4" value={otp} onChange={(e) => setOtp(e.target.value)} required maxLength="6" disabled={loading} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Mật khẩu mới</label>
                    <input type="password" className="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required disabled={loading} />
                  </div>
                  <button type="submit" className="btn btn-success w-100" disabled={loading}>
                    {loading ? 'Đang xử lý...' : 'Xác nhận Đổi mật khẩu'}
                  </button>
                  <div className="text-center mt-3">
                    <button type="button" className="btn btn-link text-secondary text-decoration-none" onClick={() => setStep(1)} disabled={loading}>
                      <i className="fas fa-arrow-left"></i> Nhập lại email
                    </button>
                  </div>
                </form>
              )}
              <hr />
              <div className="text-center">
                <Link to="/login" className="text-secondary text-decoration-none"><i className="fas fa-arrow-left"></i> Quay lại đăng nhập</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
