import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Bỏ chữ "Bearer ", lấy phần token thật

      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Giải mã + xác minh chữ ký

      req.user = await User.findById(decoded.id).select('-password'); // Gắn user vào req để Controller dùng

      next(); // Token hợp lệ -> cho đi tiếp
    } catch (error) {
      res.status(401).json({ message: 'Phiên đăng nhập hết hạn hoặc không hợp lệ' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Vui lòng đăng nhập để tiếp tục' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Truy cập bị từ chối, yêu cầu quyền quản trị' });
  }
};

const adminOrStaff = (req, res, next) => {
  if (req.user && (req.user.isAdmin || req.user.isStaff)) {
    next();
  } else {
    res.status(401).json({ message: 'Truy cập bị từ chối, yêu cầu quyền quản trị hoặc nhân viên' });
  }
};

export { protect, admin, adminOrStaff };
