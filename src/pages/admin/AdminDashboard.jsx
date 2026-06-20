import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalOrders: 0, totalProducts: 0, totalUsers: 0, topProducts: [] });
  const [loading, setLoading] = useState(false);
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo || (!userInfo.isAdmin && !userInfo.isStaff)) {
      navigate('/login');
    } else {
      fetchStats();
    }
  }, [userInfo, navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('/api/orders/stats', config);
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="mb-4">
        <Link to="/admin/products" className="btn btn-outline-secondary me-2">
          <i className="fas fa-box"></i> Sản phẩm
        </Link>
        <Link to="/admin/orders" className="btn btn-outline-secondary me-2">
          <i className="fas fa-file-invoice-dollar"></i> Đơn hàng
        </Link>
        {userInfo?.isAdmin && (
          <Link to="/admin/users" className="btn btn-outline-secondary">
            <i className="fas fa-users"></i> Tài khoản
          </Link>
        )}
      </div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Tổng quan</h2>
      </div>
      
      {loading ? (
        <div className="text-center"><div className="spinner-border text-primary" role="status"></div></div>
      ) : (
        <>
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card text-white bg-primary mb-3 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Tổng Đơn Hàng</h5>
                  <p className="card-text display-4">{stats.totalOrders}</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-white bg-success mb-3 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Tổng Sản Phẩm</h5>
                  <p className="card-text display-4">{stats.totalProducts}</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-white bg-info mb-3 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Tổng Thành Viên</h5>
                  <p className="card-text display-4">{stats.totalUsers}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">Top 5 Sản Phẩm Bán Chạy Nhất</h5>
            </div>
            <div className="card-body">
              {stats.topProducts.length > 0 ? (
                <div style={{ width: '100%', height: 400 }}>
                  <ResponsiveContainer>
                    <BarChart
                      data={stats.topProducts}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="qty" name="Số lượng bán ra" fill="#8884d8" barSize={50} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-muted text-center py-4">Chưa có dữ liệu đơn hàng</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
