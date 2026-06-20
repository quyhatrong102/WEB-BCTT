import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: 'Giỏ hàng trống' });
    return;
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
};

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private/Admin
const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    // Thống kê sản phẩm bán chạy
    const topProducts = await Order.aggregate([
      { $unwind: '$orderItems' },
      { 
        $group: { 
          _id: '$orderItems.name', 
          qty: { $sum: '$orderItems.qty' } 
        } 
      },
      { $sort: { qty: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      totalOrders,
      totalUsers,
      totalProducts,
      topProducts: topProducts.map(p => ({ name: p._id, qty: p.qty }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy dữ liệu thống kê' });
  }
};

// @desc    Delete user's order
// @route   DELETE /api/orders/:id
// @access  Private
const deleteMyOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    if (order.user && order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        return res.status(401).json({ message: 'Không có quyền hủy đơn hàng này' });
    }
    if (order.isDelivered && !req.user.isAdmin) {
        return res.status(400).json({ message: 'Không thể hủy đơn hàng đã giao' });
    }
    await Order.deleteOne({ _id: order._id });
    res.json({ message: 'Đã hủy đơn hàng thành công' });
  } else {
    res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
  }
};

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  getOrderStats,
  deleteMyOrder,
};
