// src/components/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../context/CartContext.jsx'; // Sửa đuôi file
import { motion } from 'framer-motion'; // 1. Import motion

// Các hàm helper (giữ nguyên)
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}
function truncate(text, n) { 
    if (!text) return ''; 
    return text.length > n ? text.slice(0, n) + '...' : text; 
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    addToCart(product.id, 'M', 1);
  };

  return (
    // 2. Đổi div thành motion.div và thêm whileHover
    <motion.div 
      className="col-md-6 col-lg-3"
      whileHover={{ scale: 1.03, y: -5 }} // Phóng to nhẹ và nhích lên trên khi hover
      transition={{ type: "spring", stiffness: 300 }} // Hiệu ứng mượt hơn
    >
      <div className="card product-card h-100">
        <img src={product.image} className="card-img-top product-image" alt={product.name} />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{product.name}</h5>
          <p className="card-text flex-grow-1">{truncate(product.description, 100)}</p>
          <div className="mt-auto">
            <div className="price mb-3">{formatPrice(product.price)}</div>
            <div className="d-flex gap-2">
              <Link className="btn btn-outline-primary btn-sm flex-fill" to={`/product/${product.id}`}>
                <FontAwesomeIcon icon={faEye} /> Xem
              </Link>
              <button className="btn btn-primary btn-sm flex-fill add-btn" onClick={handleAddToCart}>
                <FontAwesomeIcon icon={faCartPlus} /> Thêm
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div> // 3. Đóng thẻ motion.div
  );
}