// src/components/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faCartPlus, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../context/CartContext.jsx'; // Sửa đuôi file
import { motion } from 'framer-motion'; // 1. Import motion
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  
  const handleAddToCart = () => {
    if (!localStorage.getItem('userInfo')) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      navigate('/login');
      return;
    }
    addToCart(product, 'M', 1);
  };

  return (
    // 2. Đổi div thành motion.div và thêm whileHover
    <motion.div 
      className="col-md-6 col-lg-3"
      whileHover={{ scale: 1.03, y: -5 }} // Phóng to nhẹ và nhích lên trên khi hover
      transition={{ type: "spring", stiffness: 300 }} // Hiệu ứng mượt hơn
    >
      <div className="card h-100 product-card shadow-sm border-0 position-relative">
        <Link to={`/product/${product._id}`}>
          <img src={product.image} className="card-img-top product-img" alt={product.name} />
          {product.countInStock === 0 && (
             <span className="badge bg-danger position-absolute top-0 start-0 m-2" style={{ zIndex: 1 }}>Hết hàng</span>
          )}
        </Link>
        <div className="card-body d-flex flex-column text-center">
          <Link to={`/product/${product._id}`} className="text-decoration-none text-dark">
            <h5 className="card-title text-truncate">{product.name}</h5>
          </Link>
          <div className="mt-auto">
            <div className="price mb-3">{formatPrice(product.price)}</div>
            <div className="d-flex gap-2">
              <Link className="btn btn-outline-primary btn-sm flex-fill" to={`/product/${product._id}`}>
                <FontAwesomeIcon icon={faEye} /> Xem
              </Link>
            </div>
          </div>
          <button className={`btn ${product.countInStock === 0 ? 'btn-secondary' : 'btn-primary'} mt-auto`} onClick={handleAddToCart} disabled={product.countInStock === 0}>
            <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
            {product.countInStock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
          </button>
        </div>
      </div>
    </motion.div> // 3. Đóng thẻ motion.div
  );
}