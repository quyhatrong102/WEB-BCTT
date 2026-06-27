// src/App.jsx
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

// Import Provider vừa tạo
import { CartProvider } from './context/CartContext.jsx'; // Thêm .jsx
import { AuthProvider } from './context/AuthContext.jsx';

// Import Layout và tất cả các trang (THÊM .jsx cho TẤT CẢ)
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Contact from './pages/Contact.jsx';
import About from './pages/About.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import AdminProductEdit from './pages/admin/AdminProductEdit.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import Profile from './pages/Profile.jsx';
import MyOrders from './pages/MyOrders.jsx';
import OrderSuccess from './pages/OrderSuccess.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // Layout là "khung sườn" chung (có Header + Footer)
    children: [
      { index: true, element: <Home /> }, // "/"
      { path: 'products', element: <Products /> }, // "/products"
      { path: 'product/:id', element: <ProductDetail /> }, // "/product/123"
      { path: 'cart', element: <Cart /> },
      { path: 'checkout', element: <Checkout /> },
      { path: 'order-success', element: <OrderSuccess /> },
      { path: 'contact', element: <Contact /> },
      { path: 'about', element: <About /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'profile', element: <Profile /> },
      { path: 'myorders', element: <MyOrders /> },
      { path: 'admin', element: <AdminDashboard /> },
      { path: 'admin/products', element: <AdminProducts /> },
      { path: 'admin/product/:id/edit', element: <AdminProductEdit /> },
      { path: 'admin/orders', element: <AdminOrders /> },
      { path: 'admin/users', element: <AdminUsers /> },
    ],
  },
]);

function App() {
  return (
    <AuthProvider> {/* Bọc ngoài cùng -> mọi trang đều biết ai đang đăng nhập */}
      <CartProvider> {/* Bọc trong -> mọi trang đều truy cập được giỏ hàng */}
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;