import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo || (!userInfo.isAdmin && !userInfo.isStaff)) {
      navigate('/login');
    } else {
      fetchOrders();
    }
  }, [userInfo, navigate]);

  const fetchOrders = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get('/api/orders', config);
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        await axios.delete(`/api/orders/${id}`, config);
        fetchOrders();
        alert('Đã hủy đơn hàng thành công');
      } catch (error) {
        alert(error.response?.data?.message || 'Lỗi khi hủy đơn hàng');
      }
    }
  };

  const deliverHandler = async (id) => {
    if (window.confirm('Xác nhận đã giao đơn hàng này?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        await axios.put(`/api/orders/${id}/deliver`, {}, config);
        fetchOrders();
        alert('Đã cập nhật trạng thái giao hàng');
      } catch (error) {
        alert(error.response?.data?.message || 'Lỗi khi cập nhật đơn hàng');
      }
    }
  };

  const payHandler = async (id) => {
    if (window.confirm('Xác nhận đơn hàng này đã được thanh toán?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        await axios.put(`/api/orders/${id}/pay`, {}, config);
        fetchOrders();
        alert('Đã cập nhật trạng thái thanh toán');
      } catch (error) {
        alert(error.response?.data?.message || 'Lỗi khi cập nhật thanh toán');
      }
    }
  };

  return (
    <div className="container py-5">
      <div className="mb-4">
        <Link to="/admin" className="btn btn-outline-secondary me-2">
          <i className="fas fa-chart-line"></i> Tổng quan
        </Link>
        <Link to="/admin/products" className="btn btn-outline-secondary me-2">
          <i className="fas fa-box"></i> Sản phẩm
        </Link>
        {userInfo?.isAdmin && (
          <Link to="/admin/users" className="btn btn-outline-secondary">
            <i className="fas fa-users"></i> Tài khoản
          </Link>
        )}
      </div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Quản lý Đơn Hàng</h2>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>NGƯỜI DÙNG</th>
              <th>SẢN PHẨM ĐẶT</th>
              <th>ĐỊA CHỈ & SĐT</th>
              <th>THANH TOÁN</th>
              <th>NGÀY ĐẶT</th>
              <th>TỔNG TIỀN</th>
              <th>ĐÃ GIAO</th>
              <th>HÀNH ĐỘNG</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id.substring(order._id.length - 6)}</td>
                <td>{order.user ? order.user.name : 'Khách vãng lai'}</td>
                <td>
                  <ul className="list-unstyled mb-0">
                    {order.orderItems.map((item, index) => (
                      <li key={index} className="small">
                        {item.name} (SL: {item.qty}, Size: {item.size || 'M'})
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="small">
                  {order.shippingAddress?.address}, {order.shippingAddress?.city}<br/>
                  SĐT: <strong>{order.shippingAddress?.phone || 'N/A'}</strong>
                </td>
                <td>
                  {order.paymentMethod?.toUpperCase() || 'N/A'}<br/>
                  {order.isPaid ? (
                    <span className="badge bg-success mt-1">Đã thanh toán</span>
                  ) : (
                    <span className="badge bg-warning text-dark mt-1">Chưa thanh toán</span>
                  )}
                </td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice} đ</td>
                <td>
                  {order.isDelivered ? (
                    <span className="badge bg-success">Đã giao</span>
                  ) : (
                    <span className="badge bg-danger">Chưa giao</span>
                  )}
                </td>
                <td>
                  <div className="d-flex flex-column gap-2">
                    {!order.isPaid && (
                      <button className="btn btn-sm btn-outline-success" onClick={() => payHandler(order._id)}>
                        Xác nhận TT
                      </button>
                    )}
                    {!order.isDelivered && (
                      <button className="btn btn-sm btn-primary" onClick={() => deliverHandler(order._id)}>
                        Giao hàng
                      </button>
                    )}
                    {(!order.isDelivered || !order.isPaid) && (
                      <button className="btn btn-sm btn-danger" onClick={() => deleteHandler(order._id)}>
                        Hủy đơn
                      </button>
                    )}
                    {(order.isDelivered && order.isPaid) && (
                      <span className="text-muted fst-italic">Hoàn tất</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
