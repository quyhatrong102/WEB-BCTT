import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

export default function OrderSuccess() {
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="container py-5 text-center">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm border-success">
            <div className="card-body py-5">
              <i className="fas fa-check-circle text-success" style={{ fontSize: '5rem' }}></i>
              <h2 className="mt-4 mb-3">Đặt Hàng Thành Công!</h2>
              <p className="lead text-muted mb-4">
                Cảm ơn bạn đã mua sắm tại Fashion Store. Đơn hàng của bạn đang được xử lý.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/myorders" className="btn btn-outline-primary">
                  Xem Đơn Hàng
                </Link>
                <Link to="/" className="btn btn-primary">
                  Tiếp Tục Mua Sắm
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
