import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  );

  const login = async (email, password) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        '/api/users/login',
        { email, password },
        config
      );

      setUserInfo(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      };
    }
  };

  const register = async (name, email, password, otp) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        '/api/users',
        { name, email, password, otp },
        config
      );

      setUserInfo(data); // Lưu vào state (React re-render)
      localStorage.setItem('userInfo', JSON.stringify(data)); // Lưu vào localStorage (sống sót qua F5)
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      };
    }
  };

  const sendOTP = async (email) => {
    try {
      const { data } = await axios.post('/api/users/send-otp', { email });
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Có lỗi xảy ra khi gửi OTP' };
    }
  };

  const resetPassword = async (email, otp, newPassword) => {
    try {
      const { data } = await axios.post('/api/users/reset-password', { email, otp, newPassword });
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu' };
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
  };

  const updateUserInfo = (data) => {
    setUserInfo(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  };

  return (
    <AuthContext.Provider value={{ userInfo, login, register, logout, updateUserInfo, sendOTP, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};
