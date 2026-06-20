import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      fetchMyOrders();
    }
  }, [userInfo, navigate]);

  const fetchMyOrders = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get('/api/orders/myorders', config);
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
        fetchMyOrders();
        alert('Đã hủy đơn hàng thành công');
      } catch (error) {
        alert(error.response?.data?.message || 'Lỗi khi hủy đơn hàng');
      }
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Đơn hàng của tôi</h2>
      {orders.length === 0 ? (
        <div className="alert alert-info">Bạn chưa có đơn hàng nào.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>MÃ ĐƠN</th>
                <th>SẢN PHẨM ĐẶT</th>
                <th>TỔNG TIỀN</th>
                <th>THANH TOÁN</th>
                <th>NGÀY ĐẶT</th>
                <th>TRẠNG THÁI GIAO</th>
                <th>HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id.substring(order._id.length - 6)}</td>
                  <td>
                    <ul className="list-unstyled mb-0">
                      {order.orderItems.map((item, index) => (
                        <li key={index} className="small">
                          {item.name} (SL: {item.qty}, Size: {item.size || 'M'})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>{order.totalPrice} đ</td>
                  <td>{order.paymentMethod?.toUpperCase() || 'COD'}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>
                    {order.isDelivered ? (
                      <span className="text-success fw-bold"><i className="fas fa-check"></i> Đã giao</span>
                    ) : (
                      <span className="text-warning fw-bold"><i className="fas fa-clock"></i> Đang xử lý</span>
                    )}
                  </td>
                  <td>
                    {!order.isDelivered && (
                      <button className="btn btn-sm btn-danger" onClick={() => deleteHandler(order._id)}>
                        Hủy đơn
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
