// src/pages/Register.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import motion

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
              <form id="registerForm">
                <div className="mb-3"><label className="form-label">Họ tên</label><input type="text" className="form-control" required /></div>
                <div className="mb-3"><label className="form-label">Email</label><input type="email" className="form-control" required /></div>
                <div className="mb-3"><label className="form-label">Số điện thoại</label><input type="tel" className="form-control" /></div>
                <div className="mb-3"><label className="form-label">Mật khẩu</label><input type="password" className="form-control" required /></div>
                <div className="mb-3"><label className="form-label">Xác nhận mật khẩu</label><input type="password" className="form-control" required /></div>
                <div className="mb-3 form-check">
                  <input type="checkbox" className="form-check-input" id="agreeTerms" />
                  <label className="form-check-label" htmlFor="agreeTerms">Tôi đồng ý với <a href="#">điều khoản sử dụng</a></label>
                </div>
                <button type="submit" className="btn btn-primary w-100">Đăng Ký</button>
              </form>
              <hr />
              <div className="text-center"><p>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}