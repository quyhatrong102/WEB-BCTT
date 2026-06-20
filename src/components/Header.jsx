// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTshirt, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';

// 1. Import hook useCart
import { useCart } from '../context/CartContext';

export default function Header() {
  // 2. Lấy số lượng sản phẩm trong giỏ hàng từ Context
  const { cartItemCount } = useCart(); 

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <FontAwesomeIcon icon={faTshirt} className="me-2" />
          Fashion Store
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><Link className="nav-link" to="/">Trang Chủ</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/products">Sản Phẩm</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/about">Giới Thiệu</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/contact">Liên Hệ</Link></li>
          </ul>
          <div className="d-flex align-items-center">
            <div className="position-relative me-3">
              <Link className="btn btn-outline-light" to="/cart">
                <FontAwesomeIcon icon={faShoppingCart} />
                {/* 3. Hiển thị số lượng thật */}
                <span className="cart-badge" id="cartCount">{cartItemCount}</span>
              </Link>
            </div>
            <Link className="btn btn-outline-light" to="/login">
              <FontAwesomeIcon icon={faUser} /> Đăng Nhập
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}