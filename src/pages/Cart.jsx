// src/pages/Cart.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
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

// Hàm format tiền
function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

export default function Cart() {
  const { cart, removeFromCart, updateCartQuantity, subtotal, shipping, total } = useCart();

  const motionProps = {
    initial: "initial",
    animate: "in",
    exit: "out",
    variants: pageVariants,
    transition: pageTransition,
    className: "container py-5" // Chuyển className lên motion.div
  };

  if (cart.length === 0) {
    return (
      <motion.div {...motionProps} className="container py-5 text-center">
        <i className="fas fa-shopping-cart fa-5x text-muted mb-3"></i>
        <h4>Giỏ hàng trống</h4>
        <p className="text-muted">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
        <Link className="btn btn-primary" to="/products">Tiếp tục mua sắm</Link>
      </motion.div>
    );
  }

  return (
    <motion.div {...motionProps}>
      <h2 className="mb-4">Giỏ Hàng Của Bạn</h2>
      <div className="row">
        <div className="col-lg-8">
          <div id="cartItems">
            {cart.map((item, idx) => (
              <div className="cart-item" key={idx}>
                <div className="row align-items-center">
                  <div className="col-md-2"><img src={item.image} className="img-fluid rounded" alt={item.name} /></div>
                  <div className="col-md-4"><h6>{item.name}</h6><small className="text-muted">Kích thước: {item.size}</small></div>
                  <div className="col-md-2">
                    <div className="input-group quantity-input">
                      <button className="btn btn-outline-secondary btn-sm" onClick={() => updateCartQuantity(idx, -1)}>-</button>
                      <input type="number" className="form-control form-control-sm text-center" value={item.quantity} min="1" readOnly />
                      <button className="btn btn-outline-secondary btn-sm" onClick={() => updateCartQuantity(idx, 1)}>+</button>
                    </div>
                  </div>
                  <div className="col-md-2 text-center"><strong>{formatPrice(item.price * item.quantity)}</strong></div>
                  <div className="col-md-2 text-center">
                    <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(idx)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-lg-4">
          <div className="cart-total">
            <h4>Tổng Đơn Hàng</h4>
            <hr />
            <div className="d-flex justify-content-between">
              <span>Tạm tính:</span>
              <span id="subtotal">{formatPrice(subtotal)}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Phí vận chuyển:</span>
              <span>{formatPrice(shipping)}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold">
              <span>Tổng cộng:</span>
              <span id="total">{formatPrice(total)}</span>
            </div>
            <Link className="btn btn-primary w-100 mt-3" to="/checkout">Thanh Toán</Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}