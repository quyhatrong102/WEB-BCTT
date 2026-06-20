// src/pages/Products.jsx
import React, { useState, useMemo } from 'react';
import productsData from '../data/products.js';
import ProductCard from '../components/ProductCard.jsx';
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

export default function Products() {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');

  const filteredProducts = useMemo(() => {
    let filtered = productsData;
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }
    
    if (priceFilter !== 'all') {
      switch(priceFilter) {
        case 'under-500': 
          filtered = filtered.filter(p => p.price < 500000); 
          break;
        case '500-1000': 
          filtered = filtered.filter(p => p.price >= 500000 && p.price <= 1000000); 
          break;
        case 'over-1000': 
          filtered = filtered.filter(p => p.price > 1000000); 
          break;
        default: 
          break;
      }
    }
    return filtered;
  }, [categoryFilter, priceFilter]); 

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="container py-5" // Chuyển className lên motion.div
    >
      <h2 className="mb-4">Tất Cả Sản Phẩm</h2>

      <div className="category-filter">
        <div className="row align-items-center">
          <div className="col-md-6">
            <label htmlFor="categoryFilter" className="form-label">Lọc theo danh mục:</label>
            <select 
              className="form-select" 
              id="categoryFilter" 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="ao-thun">Áo Thun</option>
              <option value="ao-so-mi">Áo Sơ Mi</option>
              <option value="ao-hoodie">Áo Hoodie</option>
              <option value="ao-khoac">Áo Khoác</option>
            </select>
          </div>
          <div className="col-md-6">
              <label htmlFor="priceFilter" className="form-label">Lọc theo giá:</label>
            <select 
              className="form-select" 
              id="priceFilter" 
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="under-500">Dưới 500.000đ</option>
              <option value="500-1000">500.000đ - 1.000.000đ</option>
              <option value="over-1000">Trên 1.000.000đ</option>
            </select>
          </div>
        </div>
      </div>

      <div className="row" id="allProducts">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-12 text-center"><p className="text-muted">Không tìm thấy sản phẩm nào.</p></div>
        )}
      </div>
    </motion.div>
  );
}