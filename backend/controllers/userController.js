import User from '../models/userModel.js';
import OTP from '../models/otpModel.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isStaff: user.isStaff,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Lỗi hệ thống' });
  }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
// @desc    Send OTP to email
// @route   POST /api/users/send-otp
// @access  Public
const sendOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Vui lòng cung cấp email' });
  }

  // Tạo OTP 6 số ngẫu nhiên
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Lưu OTP vào DB (Sẽ tự động xóa sau 5 phút do index TTL đã thiết lập)
    await OTP.create({ email, otp });

    // Gửi email
    await sendEmail({
      email: email,
      subject: 'Mã xác nhận OTP - Fashion Store',
      message: 'Xin chào, đây là mã xác nhận OTP của bạn để tiếp tục thực hiện thao tác. Vui lòng không chia sẻ mã này cho ai khác.',
      otp: otp,
    });

    res.status(200).json({ success: true, message: 'Mã OTP đã được gửi đến email của bạn' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Lỗi hệ thống khi gửi email' });
  }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: 'Email này đã được sử dụng' });
      return;
    }

    // Xác thực OTP
    if (!otp) {
      res.status(400).json({ message: 'Vui lòng cung cấp mã OTP' });
      return;
    }
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      res.status(400).json({ message: 'Mã OTP không hợp lệ hoặc đã hết hạn' });
      return;
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isStaff: user.isStaff,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Dữ liệu người dùng không hợp lệ' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Lỗi hệ thống' });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isStaff: user.isStaff,
      });
    } else {
      res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Lỗi hệ thống' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        isStaff: updatedUser.isStaff,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
  } catch (error) {
    // Xử lý lỗi trùng email
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email này đã tồn tại' });
    }
    res.status(500).json({ message: error.message || 'Lỗi hệ thống' });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Lỗi hệ thống' });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Không thể xóa chính mình' });
    }

    const user = await User.findById(req.params.id);

    if (user) {
      await User.deleteOne({ _id: user._id });
      res.json({ message: 'Đã xóa người dùng' });
    } else {
      res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Lỗi hệ thống' });
  }
};

// @desc    Reset password
// @route   POST /api/users/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy tài khoản với email này' });
    }

    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Mã OTP không hợp lệ hoặc đã hết hạn' });
    }

    user.password = newPassword;
    await user.save();

    // Xóa OTP sau khi đổi pass thành công
    await OTP.deleteMany({ email });

    res.json({ message: 'Đổi mật khẩu thành công. Vui lòng đăng nhập lại.' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Lỗi hệ thống' });
  }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Không thể tự đổi quyền chính mình' });
    }

    const user = await User.findById(req.params.id);
    const { role } = req.body;

    if (user) {
      if (role === 'admin') {
        user.isAdmin = true;
        user.isStaff = false;
      } else if (role === 'staff') {
        user.isAdmin = false;
        user.isStaff = true;
      } else if (role === 'user') {
        user.isAdmin = false;
        user.isStaff = false;
      }

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        isStaff: updatedUser.isStaff,
      });
    } else {
      res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Lỗi hệ thống' });
  }
};

export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  sendOTP,
  resetPassword,
  updateUserRole,
};
