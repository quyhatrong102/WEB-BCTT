// src/pages/Login.jsx
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

export default function Login() {
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
            <div className="card-header text-center"><h4>Đăng Nhập</h4></div>
            <div className="card-body">
              <form id="loginForm">
                <div className="mb-3">
                  <label htmlFor="loginEmail" className="form-label">Email</label>
                  <input type="email" className="form-control" id="loginEmail" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="loginPassword" className="form-label">Mật khẩu</label>
                  <input type="password" className="form-control" id="loginPassword" required />
                </div>
                <div className="mb-3 form-check">
                  <input type="checkbox" className="form-check-input" id="rememberMe" />
                  <label className="form-check-label" htmlFor="rememberMe">Ghi nhớ đăng nhập</label>
                </div>
                <button type="submit" className="btn btn-primary w-100">Đăng Nhập</button>
              </form>
              <hr />
              <div className="text-center">
                <p>Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
                <a href="#" className="text-muted">Quên mật khẩu?</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}