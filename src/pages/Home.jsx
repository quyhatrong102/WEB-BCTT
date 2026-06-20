// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import productsData from '../data/products.js';
import { motion } from 'framer-motion'; // 1. Import motion

// 2. Định nghĩa 1 object chứa các hiệu ứng
const pageVariants = {
  initial: {
    opacity: 0,
    x: "-100vw" // Bắt đầu từ bên trái
  },
  in: {
    opacity: 1,
    x: 0 // Di chuyển vào 0
  },
  out: {
    opacity: 0,
    x: "100vw" // Di chuyển ra bên phải
  }
};

// 3. Định nghĩa object cho transition
const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    setFeaturedProducts(productsData.slice(0, 4));
  }, []);

  return (
    // 4. Bọc toàn bộ trang bằng motion.div
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {/* Hero Section (copy từ index.html) */}
      <section className="hero-section">
        {/* ... (Nội dung bên trong giữ nguyên) ... */}
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">Thời Trang Đẳng Cấp</h1>
              <p className="lead mb-4">Khám phá bộ sưu tập áo thời trang mới nhất với chất lượng cao và thiết kế hiện đại</p>
              <Link className="btn btn-primary btn-lg" to="/products">Mua Sắm Ngay</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-5">
        {/* ... (Nội dung bên trong giữ nguyên) ... */}
        <div className="container">
          <h2 className="text-center mb-5">Sản Phẩm Nổi Bật</h2>
          <div className="row" id="featuredProducts">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section (copy từ index.html) */}
      <section className="py-5 bg-light">
        {/* ... (Nội dung bên trong giữ nguyên) ... */}
        <div className="container">
          <div className="row">
            <div className="col-md-4 text-center mb-4">
              <i className="fas fa-shipping-fast fa-3x text-primary mb-3"></i>
              <h4>Giao Hàng Nhanh</h4>
              <p>Giao hàng toàn quốc trong 24-48h</p>
            </div>
            <div className="col-md-4 text-center mb-4">
              <i className="fas fa-shield-alt fa-3x text-primary mb-3"></i>
              <h4>Bảo Hành Chất Lượng</h4>
              <p>Cam kết chất lượng 100% hàng chính hãng</p>
            </div>
            <div className="col-md-4 text-center mb-4">
              <i className="fas fa-phone-alt fa-3x text-primary mb-3"></i>
              <h4>Hỗ Trợ 24/7</h4>
              <p>Đội ngũ tư vấn nhiệt tình, chuyên nghiệp</p>
            </div>
          </div>
        </div>
      </section>
    </motion.div> // 5. Đóng thẻ motion.div
  );
}