import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!userInfo || (!userInfo.isAdmin && !userInfo.isStaff)) {
      navigate('/login');
      return;
    }

    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setCategory(data.category);
        setDescription(data.description);
        setCountInStock(data.countInStock);
      } catch (error) {
        alert('Lỗi tải sản phẩm');
      }
    };
    fetchProduct();
  }, [id, navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.put(
        `/api/products/${id}`,
        {
          name,
          price,
          image,
          category,
          description,
          countInStock,
        },
        config
      );
      
      alert('Cập nhật sản phẩm thành công!');
      navigate('/admin');
    } catch (error) {
      console.error(error);
      alert('Lỗi cập nhật sản phẩm: ' + (error.response?.data?.message || error.message));
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post('/api/upload', formData, config);
      setImage(data);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
      alert('Upload ảnh thất bại');
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Chỉnh sửa sản phẩm</h2>
        <Link to="/admin" className="btn btn-secondary">
          <i className="fas fa-arrow-left"></i> Quay lại
        </Link>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={submitHandler}>
            <div className="mb-3">
              <label className="form-label">Tên sản phẩm</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Giá (VNĐ)</label>
              <input
                type="number"
                className="form-control"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Hình ảnh</label>
              <input
                type="text"
                className="form-control mb-2"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Nhập URL ảnh hoặc chọn file bên dưới"
                required
              />
              <input
                className="form-control"
                type="file"
                id="image-file"
                onChange={uploadFileHandler}
              />
              {uploading && <div className="mt-2">Đang tải ảnh lên...</div>}
              {image && (
                <div className="mt-2">
                  <img src={image} alt={name} className="img-thumbnail" style={{ height: '100px' }} />
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Danh mục</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Chọn danh mục...</option>
                <option value="ao-thun">Áo Thun</option>
                <option value="ao-so-mi">Áo Sơ Mi</option>
                <option value="ao-hoodie">Áo Hoodie</option>
                <option value="ao-khoac">Áo Khoác</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Số lượng tồn kho</label>
              <input
                type="number"
                className="form-control"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
                required
                min="0"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Mô tả</label>
              <textarea
                className="form-control"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Cập Nhật Sản Phẩm
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
