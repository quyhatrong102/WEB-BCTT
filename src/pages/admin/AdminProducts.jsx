import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo || (!userInfo.isAdmin && !userInfo.isStaff)) {
      navigate('/login');
    } else {
      fetchProducts();
    }
  }, [userInfo, navigate]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const createProductHandler = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.post('/api/products', {}, config);
      fetchProducts();
    } catch (error) {
      alert('Tạo sản phẩm thất bại');
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        await axios.delete(`/api/products/${id}`, config);
        fetchProducts();
      } catch (error) {
        alert('Xóa thất bại');
      }
    }
  };

  const formatCategory = (cat) => {
    switch (cat) {
      case 'ao-thun': return 'Áo Thun';
      case 'ao-so-mi': return 'Áo Sơ Mi';
      case 'ao-hoodie': return 'Áo Hoodie';
      case 'ao-khoac': return 'Áo Khoác';
      default: return cat;
    }
  };

  return (
    <div className="container py-5">
      <div className="mb-4">
        <Link to="/admin" className="btn btn-outline-secondary me-2">
          <i className="fas fa-chart-line"></i> Tổng quan
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
        <h2>Quản lý sản phẩm</h2>
        <button className="btn btn-primary" onClick={createProductHandler}>
          <i className="fas fa-plus"></i> Thêm Sản Phẩm
        </button>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>TÊN</th>
              <th>GIÁ</th>
              <th>DANH MỤC</th>
              <th>HÀNH ĐỘNG</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id.substring(product._id.length - 6)}</td>
                <td>{product.name}</td>
                <td>{product.price} đ</td>
                <td>{formatCategory(product.category)}</td>
                <td>
                  <Link to={`/admin/product/${product._id}/edit`} className="btn btn-sm btn-warning me-2">
                    <i className="fas fa-edit"></i> Sửa
                  </Link>
                  <button className="btn btn-sm btn-danger" onClick={() => deleteHandler(product._id)}>
                    <i className="fas fa-trash"></i> Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
