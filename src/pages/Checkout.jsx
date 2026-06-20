// src/pages/Checkout.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
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

export default function Checkout() {
  const { cart, subtotal, shipping, total, clearCart } = useCart();
  const navigate = useNavigate();

  const handleSubmitOrder = (event) => {
    event.preventDefault(); 
    
    const form = document.getElementById('checkoutForm');
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (cart.length === 0) {
      alert('Giỏ hàng trống!');
      return;
    }

    alert('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.');
    
    clearCart(); 
    navigate('/');
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
      <h2 className="mb-4">Thanh Toán</h2>
      <div className="row">
        <div className="col-lg-8">
          <form id="checkoutForm" onSubmit={handleSubmitOrder}>
            <div className="card mb-4">
              <div className="card-header">
                <h5>Thông Tin Giao Hàng</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="firstName" className="form-label">Họ</label>
                    <input type="text" className="form-control" id="firstName" required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="lastName" className="form-label">Tên</label>
                    <input type="text" className="form-control" id="lastName" required />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input type="email" className="form-control" id="email" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">Số điện thoại</label>
                  <input type="tel" className="form-control" id="phone" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">Địa chỉ</label>
                  <textarea className="form-control" id="address" rows="3" required></textarea>
                </div>
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-header">
                <h5>Phương Thức Thanh Toán</h5>
              </div>
              <div className="card-body">
                <div className="form-check mb-3">
                  <input className="form-check-input" type="radio" name="paymentMethod" id="cod" value="cod" defaultChecked />
                  <label className="form-check-label" htmlFor="cod">Thanh toán khi nhận hàng (COD)</label>
                </div>
                <div className="form-check mb-3">
                  <input className="form-check-input" type="radio" name="paymentMethod" id="transfer" value="transfer" />
                  <label className="form-check-label" htmlFor="transfer">Chuyển khoản ngân hàng</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="paymentMethod" id="card" value="card" />
                  <label className="form-check-label" htmlFor="card">Thẻ tín dụng/ghi nợ</label>
                </div>
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary w-100 d-lg-none mb-4">Đặt Hàng</button>
          </form>
        </div>
        
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header"><h5>Đơn Hàng Của Bạn</h5></div>
            <div className="card-body" id="checkoutSummary">
              {cart.length === 0 ? (
                <p className="text-muted">Giỏ hàng trống</p>
              ) : (
                cart.map((item, idx) => (
                  <div className="d-flex justify-content-between mb-2" key={idx}>
                    <span>{item.name} ({item.size}) x{item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))
              )}
              <hr />
              <div className="d-flex justify-content-between">
                <span>Tạm tính:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Phí vận chuyển:</span>
                <span>{formatPrice(shipping)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Tổng cộng:</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <div className="card-footer d-none d-lg-block">
              <button type="submit" form="checkoutForm" className="btn btn-primary w-100">Đặt Hàng</button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}