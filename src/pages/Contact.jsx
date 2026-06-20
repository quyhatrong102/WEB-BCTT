// src/pages/Contact.jsx
import React from 'react';
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

export default function Contact() {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="container py-5" // Chuyển className lên motion.div
    >
      <h2 className="text-center mb-5">Liên Hệ Với Chúng Tôi</h2>
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="row">
            <div className="col-md-4 text-center mb-4">
              <i className="fas fa-map-marker-alt fa-2x text-primary mb-3"></i>
              <h5>Địa Chỉ</h5>
              <p>123 Đường ABC, Quận XYZ<br />Thành phố Hà Nội</p>
            </div>
            <div className="col-md-4 text-center mb-4">
              <i className="fas fa-phone fa-2x text-primary mb-3"></i>
              <h5>Điện Thoại</h5>
              <p>0123-456-789<br />0987-654-321</p>
            </div>
            <div className="col-md-4 text-center mb-4">
              <i className="fas fa-envelope fa-2x text-primary mb-3"></i>
              <h5>Email</h5>
              <p>info@fashionstore.com<br />support@fashionstore.com</p>
            </div>
          </div>

          <div className="card mt-5">
            <div className="card-header"><h5>Gửi Tin Nhắn</h5></div>
            <div className="card-body">
              <form>
                <div className="row">
                  <div className="col-md-6 mb-3"><input type="text" className="form-control" placeholder="Họ tên" /></div>
                  <div className="col-md-6 mb-3"><input type="email" className="form-control" placeholder="Email" /></div>
                </div>
                <div className="mb-3"><input type="text" className="form-control" placeholder="Tiêu đề" /></div>
                <div className="mb-3"><textarea className="form-control" rows="5" placeholder="Nội dung tin nhắn"></textarea></div>
                <button type="submit" className="btn btn-primary">Gửi Tin Nhắn</button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}