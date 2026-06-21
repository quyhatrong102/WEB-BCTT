// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { motion } from 'framer-motion';

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

export default function ProductDetail() {
  const { id } = useParams(); 
  const { addToCart } = useCart();
  const navigate = useNavigate(); 

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('M');
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      try {
        const { data: prod } = await axios.get(`/api/products/${id}`);
        setProduct(prod);

        if (prod) {
          const { data: allProducts } = await axios.get('/api/products');
          const related = allProducts.filter(p => p.category === prod.category && p._id !== prod._id).slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error('Error fetching product', error);
      }
    };

    fetchProductAndRelated();
    setQuantity(1);
    setSize('M');

  }, [id]); 

  if (!product) {
    return (
        <motion.div 
            initial="initial" 
            animate="in" 
            exit="out" 
            variants={pageVariants} 
            transition={pageTransition}
            className="container py-5"
        >
            <p className="text-muted">Sản phẩm không tồn tại.</p>
        </motion.div>
    );
  }

  const handleAddToCart = () => {
    if (!localStorage.getItem('userInfo')) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      navigate('/login');
      return;
    }
    addToCart(product, size, quantity);
  };

  const handleBuyNow = () => {
    if (!localStorage.getItem('userInfo')) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      navigate('/login');
      return;
    }
    addToCart(product, size, quantity);
    navigate('/cart');
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
      <div id="productDetailContent">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-reset">Trang chủ</Link></li>
            <li className="breadcrumb-item"><Link to="/products" className="text-decoration-none text-reset">Sản phẩm</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
          </ol>
        </nav>
        <div className="row">
          <div className="col-lg-6">
            <img src={product.image} className="img-fluid product-detail-img rounded" alt={product.name} />
          </div>
          <div className="col-lg-6">
            <h1 className="mb-3">{product.name}</h1>
            <div className="price mb-4">{formatPrice(product.price)}</div>
            <div className="mb-4"><h5>Mô tả sản phẩm:</h5><p>{product.description}</p></div>
            
            <div className="mb-4">
              <h5>Kích thước:</h5>
              {product.countInStock === 0 ? (
                <span className="badge bg-danger fs-6">Hết hàng</span>
              ) : (
                <span className="badge bg-success fs-6">Còn lại: {product.countInStock} sản phẩm</span>
              )}
              <div className="btn-group mt-3 d-block" role="group">
                {['S', 'M', 'L', 'XL'].map(s => (
                  <React.Fragment key={s}>
                    <input
                      type="radio"
                      className="btn-check"
                      name="size"
                      id={`size${s}`}
                      value={s}
                      checked={size === s}
                      onChange={() => setSize(s)}
                    />
                    <label className="btn btn-outline-secondary" htmlFor={`size${s}`}>{s}</label>
                  </React.Fragment>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <h5>Số lượng:</h5>
              <div className="input-group quantity-input">
                <button className="btn btn-outline-secondary" type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={product.countInStock === 0}>-</button>
                <input type="number" className="form-control text-center" value={quantity} min="1" max={product.countInStock} onChange={(e) => setQuantity(Math.min(product.countInStock, Math.max(1, parseInt(e.target.value, 10) || 1)))} disabled={product.countInStock === 0} />
                <button className="btn btn-outline-secondary" type="button" onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))} disabled={product.countInStock === 0}>+</button>
              </div>
            </div>
            
            <div className="d-flex gap-3">
              <button className="btn btn-primary btn-lg" onClick={handleAddToCart} disabled={product.countInStock === 0}>
                <i className="fas fa-cart-plus"></i> Thêm vào giỏ hàng
              </button>
              <button className="btn btn-success btn-lg" onClick={handleBuyNow} disabled={product.countInStock === 0}>
                <i className="fas fa-shopping-bag"></i> Mua ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h3>Sản phẩm liên quan</h3>
        <div className="row" id="relatedProducts">
          {relatedProducts.map(p => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}