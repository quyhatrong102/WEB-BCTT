// src/pages/About.jsx
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

export default function About() {
  return (
    // Bọc nội dung trang bằng motion.div
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="container py-5" // Chuyển className lên motion.div
    >
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <h2 className="text-center mb-5">Về Fashion Store</h2>
          <p className="lead text-center mb-5">Thương hiệu thời trang hàng đầu, mang đến sản phẩm chất lượng cao với thiết kế hiện đại.</p>
          <div className="row mb-5">
            <div className="col-md-6 mb-4"><h4>Tầm Nhìn</h4><p>Trở thành thương hiệu thời trang hàng đầu Việt Nam, mang đến phong cách sống hiện đại và đẳng cấp.</p></div>
            <div className="col-md-6 mb-4"><h4>Sứ Mệnh</h4><p>Cung cấp những sản phẩm thời trang chất lượng cao, phù hợp với xu hướng và giá cả hợp lý.</p></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}