// src/pages/Login.jsx
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

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const { login, userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
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
            <div className="card-header text-center"><h4>Đăng Nhập</h4></div>
            <div className="card-body">
              {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
              <form onSubmit={submitHandler}>
                <div className="mb-3">
                  <label htmlFor="loginEmail" className="form-label">Email</label>
                  <input type="email" className="form-control" id="loginEmail" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="loginPassword" className="form-label">Mật khẩu</label>
                  <input type="password" className="form-control" id="loginPassword" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="mb-3 form-check">
                  <input type="checkbox" className="form-check-input" id="rememberMe" />
                  <label className="form-check-label" htmlFor="rememberMe">Ghi nhớ đăng nhập</label>
                </div>
                <button type="submit" className="btn btn-primary w-100 mt-2">Đăng Nhập</button>
              </form>
              <div className="text-center mt-3">
                <Link to="/forgot-password" className="text-secondary text-decoration-none">Quên mật khẩu?</Link>
              </div>
              <hr />
              <div className="text-center">
                <p>Chưa có tài khoản? <Link to="/register" className="text-secondary text-decoration-underline">Đăng ký ngay</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}