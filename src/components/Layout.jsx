// src/components/Layout.jsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import { AnimatePresence } from 'framer-motion';

export default function Layout() {
  // 1. Lấy vị trí (location) hiện tại
  const location = useLocation();

  return (
    <>
      <Header />
      <main className="page-section">
        {/* 2. Bọc Outlet bằng AnimatePresence */}
        {/* mode="wait" đảm bảo component cũ chuyển động ra xong thì component mới mới vào */}
        <AnimatePresence mode="wait">
          {/* 3. Thêm key={location.pathname} để AnimatePresence biết khi nào trang thay đổi */}
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}