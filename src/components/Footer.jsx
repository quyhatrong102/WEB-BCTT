// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
// Bạn có thể import icon Facebook, Instagram... từ @fortawesome/free-brands-svg-icons nếu muốn

export default function Footer() {
  return (
    <footer className="footer mt-5">
      <div className="container">
        <div className="row">
            <div className="col-md-4 mb-4">
                <h5>Fashion Store</h5>
                <p>Thương hiệu thời trang hàng đầu với chất lượng cao và thiết kế hiện đại.</p>
                <div className="d-flex">
                    {/* Bạn có thể thay <i> bằng FontAwesomeIcon nếu đã cài free-brands-svg-icons */}
                    <a href="#" className="text-white me-3"><i className="fab fa-facebook-f"></i></a>
                    <a href="#" className="text-white me-3"><i className="fab fa-instagram"></i></a>
                    <a href="#" className="text-white me-3"><i className="fab fa-youtube"></i></a>
                </div>
            </div>
            <div className="col-md-4 mb-4">
                <h5>Liên Kết</h5>
                <ul className="list-unstyled">
                    <li><Link to="/about" className="text-white-50">Giới thiệu</Link></li>
                    <li><Link to="/products" className="text-white-50">Sản phẩm</Link></li>
                    <li><Link to="/contact" className="text-white-50">Liên hệ</Link></li>
                    <li><a href="#" className="text-white-50">Chính sách bảo hành</a></li>
                </ul>
            </div>
            <div className="col-md-4 mb-4">
                <h5>Hỗ Trợ</h5>
                <ul className="list-unstyled">
                    <li><a href="#" className="text-white-50">Hướng dẫn mua hàng</a></li>
                    <li><a href="#" className="text-white-50">Chính sách đổi trả</a></li>
                    <li><a href="#" className="text-white-50">Phương thức thanh toán</a></li>
                    <li><a href="#" className="text-white-50">Vận chuyển</a></li>
                </ul>
            </div>
        </div>
        <hr className="text-white-50" />
        <div className="text-center"><p>&copy; 2025 Fashion Store. Tất cả quyền được bảo lưu.</p></div>
      </div>
    </footer>
  );
}