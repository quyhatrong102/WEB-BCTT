import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
    } else {
      fetchUsers();
    }
  }, [userInfo, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('/api/users', config);
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`/api/users/${id}`, config);
        fetchUsers();
        alert('Đã xóa người dùng');
      } catch (error) {
        alert(error.response?.data?.message || 'Lỗi khi xóa người dùng');
      }
    }
  };

  const changeRoleHandler = async (id, role) => {
    if (window.confirm('Xác nhận thay đổi quyền của tài khoản này?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.put(`/api/users/${id}/role`, { role }, config);
        fetchUsers();
      } catch (error) {
        alert(error.response?.data?.message || 'Lỗi khi cập nhật quyền');
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
        <Link to="/admin/orders" className="btn btn-outline-secondary">
          <i className="fas fa-file-invoice-dollar"></i> Đơn hàng
        </Link>
      </div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Quản lý Tài Khoản</h2>
      </div>
      
      {loading ? (
        <div className="text-center"><div className="spinner-border text-primary" role="status"></div></div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>HỌ TÊN</th>
                <th>EMAIL</th>
                <th>VAI TRÒ</th>
                <th>HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id.substring(user._id.length - 6)}</td>
                  <td>{user.name}</td>
                  <td><a href={`mailto:${user.email}`} className="text-reset text-decoration-none">{user.email}</a></td>
                  <td>
                    {user.isAdmin ? (
                      <span className="badge bg-danger">Quản trị viên</span>
                    ) : user.isStaff ? (
                      <span className="badge bg-warning text-dark">Nhân viên</span>
                    ) : (
                      <span className="badge bg-primary">Khách hàng</span>
                    )}
                  </td>
                  <td>
                    <select
                      className="form-select form-select-sm d-inline-block w-auto me-2"
                      value={user.isAdmin ? 'admin' : user.isStaff ? 'staff' : 'user'}
                      onChange={(e) => changeRoleHandler(user._id, e.target.value)}
                      disabled={user._id === userInfo._id} // Không tự đổi quyền chính mình
                    >
                      <option value="user">Khách hàng</option>
                      <option value="staff">Nhân viên</option>
                      <option value="admin">Quản trị viên</option>
                    </select>
                    <button 
                      className="btn btn-sm btn-danger" 
                      onClick={() => deleteHandler(user._id)}
                      disabled={user._id === userInfo._id} // Không tự xóa mình
                    >
                      <i className="fas fa-trash"></i>
                    </button>
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
