// src/context/CartContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import productsData from '../data/products.js'; // Import data sản phẩm từ thư mục data

// 1. Tạo Context
const CartContext = createContext();

// Key để lưu giỏ hàng trong localStorage
const CART_KEY = 'fashion_cart_v1';

// 2. Tạo Provider Component (Component "Cha" sẽ bọc toàn bộ App)
export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // 3. Load giỏ hàng từ localStorage khi App khởi động
  // (Tương tự hàm loadCartFromStorage)
  useEffect(() => {
    try {
      const storedCart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
      setCart(storedCart);
    } catch (e) {
      console.error("Lỗi khi load giỏ hàng từ localStorage", e);
      setCart([]);
    }
  }, []); // [] nghĩa là chỉ chạy 1 lần

  // 4. Lưu giỏ hàng vào localStorage mỗi khi state 'cart' thay đổi
  // (Tương tự hàm saveCartToStorage)
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]); // [cart] nghĩa là chạy lại mỗi khi 'cart' thay đổi

  // 5. Các hàm xử lý giỏ hàng (Chuyển từ app.js sang)
  
  // Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = (product, size = 'M', quantity = 1) => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      window.location.href = '/login';
      return;
    }

    if (!product || !product._id) return;

    const productId = product._id;

    setCart(prevCart => {
      const existing = prevCart.find(c => c.id === productId && c.size === size);
      
      if (existing) {
        // Nếu đã tồn tại -> cập nhật số lượng
        return prevCart.map(item =>
          item.id === productId && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Nếu chưa tồn tại -> thêm mới vào mảng
        return [...prevCart, { 
          id: product._id, 
          name: product.name, 
          price: product.price, 
          image: product.image, 
          size, 
          quantity 
        }];
      }
    });
    
    // Tạm thời alert, bạn có thể thay bằng thư viện thông báo (toast) cho đẹp
    alert(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  // Hàm xóa toàn bộ giỏ hàng
  const clearCart = () => {
    setCart([]);
  };

  // Hàm xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (index) => {
    setCart(prevCart => prevCart.filter((_, i) => i !== index));
  };

  // Hàm cập nhật số lượng (tăng/giảm)
  const updateCartQuantity = (index, delta) => {
    setCart(prevCart => prevCart.map((item, i) =>
      i === index
        ? { ...item, quantity: Math.max(1, item.quantity + delta) } // Đảm bảo số lượng ít nhất là 1
        : item
    ));
  };

  // Hàm cập nhật kích thước (size)
  const updateCartSize = (index, newSize) => {
    setCart(prevCart => {
      const itemToUpdate = prevCart[index];
      // Kiểm tra xem đã có sản phẩm cùng ID và cùng size mới chưa
      const existingIdx = prevCart.findIndex((item, i) => i !== index && item.id === itemToUpdate.id && item.size === newSize);
      
      if (existingIdx >= 0) {
        // Gộp số lượng vào sản phẩm đã có và xóa sản phẩm hiện tại
        const updatedCart = [...prevCart];
        updatedCart[existingIdx].quantity += itemToUpdate.quantity;
        updatedCart.splice(index, 1);
        return updatedCart;
      } else {
        // Chỉ đổi size
        const updatedCart = [...prevCart];
        updatedCart[index] = { ...updatedCart[index], size: newSize };
        return updatedCart;
      }
    });
  };

  // 6. Tính toán các giá trị tổng hợp từ giỏ hàng
  const subtotal = cart.reduce((s, it) => s + (it.price * it.quantity), 0);
  const shipping = cart.length > 0 ? 30000 : 0; // 30k phí ship nếu có hàng
  const total = subtotal + shipping;
  const cartItemCount = cart.reduce((s, it) => s + (it.quantity || 0), 0);
  
  // 7. Cung cấp tất cả state và hàm cho các component con
  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    updateCartSize,
    clearCart,
    subtotal,
    shipping,
    total,
    cartItemCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// 8. Tạo một "custom hook" để dễ dàng gọi Context từ bất kỳ component nào
export function useCart() {
  return useContext(CartContext);
}