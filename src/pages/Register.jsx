// src/pages/Register.jsx
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

// Định nghĩa variant cho FADE IN/OUT
const pageVariants = {
  initial: {
    opacity: 0,
    x: "-100vw"
  },
  in: {
    opacity: 1,
    x: 0
  },
  out: {
    opacity: 0,
    x: "100vw"
  }
};

// Định nghĩa transition
const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const { register, sendOTP, userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      setErrorMsg('Vui lòng đồng ý với điều khoản sử dụng');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu không khớp');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    const result = await sendOTP(email);
    setLoading(false);
    if (result.success) {
      setSuccessMsg('Mã OTP đã được gửi đến email của bạn');
      setStep(2); // Chuyển sang bước nhập OTP
    } else {
      setErrorMsg(result.message);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    const result = await register(name, email, password, otp);
    setLoading(false);
    if (!result.success) {
      setErrorMsg(result.message);
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="container py-5" // Chuyển className lên motion.div
    >
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card">
            <div className="card-header text-center"><h4>Đăng Ký</h4></div>
            <div className="card-body">
              {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
              {successMsg && <div className="alert alert-success">{successMsg}</div>}
              {step === 1 ? (
                <form onSubmit={handleSendOTP}>
                  <div className="mb-3"><label className="form-label">Họ tên</label><input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required disabled={loading}/></div>
                  <div className="mb-3"><label className="form-label">Email</label><input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading}/></div>
                  <div className="mb-3"><label className="form-label">Mật khẩu</label><input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading}/></div>
                  <div className="mb-3"><label className="form-label">Xác nhận mật khẩu</label><input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={loading}/></div>
                  <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="agreeTerms" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} disabled={loading}/>
                    <label className="form-check-label" htmlFor="agreeTerms">Tôi đồng ý với <a href="#" className="text-secondary text-decoration-underline">điều khoản sử dụng</a></label>
                  </div>
                  <button type="submit" className="btn btn-primary w-100" disabled={!agreeTerms || loading}>
                    {loading ? 'Đang gửi mã...' : 'Tiếp tục (Nhận mã OTP)'}
                  </button>
                </form>
              ) : (
                <form onSubmit={submitHandler}>
                  <div className="mb-3 text-center">
                    <p>Mã xác nhận (OTP) gồm 6 chữ số đã được gửi đến <strong>{email}</strong></p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nhập mã OTP</label>
                    <input type="text" className="form-control text-center fs-4 letter-spacing-5" value={otp} onChange={(e) => setOtp(e.target.value)} required maxLength="6" disabled={loading}/>
                  </div>
                  <button type="submit" className="btn btn-success w-100" disabled={loading}>
                    {loading ? 'Đang xử lý...' : 'Hoàn tất Đăng ký'}
                  </button>
                  <div className="text-center mt-3">
                    <button type="button" className="btn btn-link text-secondary text-decoration-none" onClick={() => setStep(1)} disabled={loading}>
                      <i className="fas fa-arrow-left"></i> Quay lại
                    </button>
                  </div>
                </form>
              )}
              <hr />
              <div className="text-center"><p>Đã có tài khoản? <Link to="/login" className="text-secondary text-decoration-underline">Đăng nhập</Link></p></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}