// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTshirt, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';

// 1. Import hook useCart
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

export default function Header() {
  // 2. Lấy số lượng sản phẩm trong giỏ hàng từ Context
  const { cartItemCount } = useCart(); 
  const { userInfo, logout } = useContext(AuthContext);

  const logoutHandler = () => {
    logout();
  };

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
              {userInfo ? (
                <div className="dropdown">
                  <button className="btn btn-outline-light dropdown-toggle" type="button" id="userMenu" data-bs-toggle="dropdown" aria-expanded="false">
                    <FontAwesomeIcon icon={faUser} className="me-1" /> {userInfo.name}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">
                    {(userInfo.isAdmin || userInfo.isStaff) && (
                      <li><Link className="dropdown-item" to="/admin">Trang Quản Trị</Link></li>
                    )}
                    <li><Link className="dropdown-item" to="/profile">Đổi mật khẩu</Link></li>
                    <li><Link className="dropdown-item" to="/myorders">Đơn mua</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item" onClick={logoutHandler}>Đăng xuất</button></li>
                  </ul>
                </div>
              ) : (
                <Link className="btn btn-outline-light" to="/login">
                  <FontAwesomeIcon icon={faUser} /> Đăng Nhập
                </Link>
              )}
            </div>
        </div>
      </div>
    </nav>
  );
}