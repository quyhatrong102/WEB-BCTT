import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400).json({ message: 'Giỏ hàng trống' });
      return;
    } else {
      // Get real prices and details from DB
      const itemsFromDB = await Product.find({
        _id: { $in: orderItems.map((x) => x.product) },
      });

      const dbOrderItems = orderItems.map((itemFromClient) => {
        const matchingItemFromDB = itemsFromDB.find(
          (itemFromDB) => itemFromDB._id.toString() === itemFromClient.product
        );

        if (!matchingItemFromDB) {
          throw new Error('Một sản phẩm trong giỏ hàng không còn tồn tại hoặc đã bị xóa');
        }

        if (matchingItemFromDB.countInStock < itemFromClient.qty) {
          throw new Error(`Sản phẩm ${matchingItemFromDB.name} chỉ còn ${matchingItemFromDB.countInStock} cái`);
        }

        return {
          name: matchingItemFromDB.name,
          qty: itemFromClient.qty,
          size: itemFromClient.size || 'M',
          image: matchingItemFromDB.image,
          price: matchingItemFromDB.price,
          product: itemFromClient.product,
        };
      });

      const itemsPrice = dbOrderItems.reduce((acc, item) => acc + item.price * item.qty, 0);
      const shippingPrice = itemsPrice >= 1000000 ? 0 : 30000;
      const taxPrice = 0;
      const totalPrice = itemsPrice + shippingPrice + taxPrice;

      const order = new Order({
        orderItems: dbOrderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      const createdOrder = await order.save();

      // Deduct inventory (Atomic update to prevent race conditions)
      for (const item of dbOrderItems) {
        await Product.findOneAndUpdate(
          { _id: item.product, countInStock: { $gte: item.qty } },
          { $inc: { countInStock: -item.qty } }
        );
      }

      res.status(201).json(createdOrder);
    }
  } catch (error) {
    res.status(400).json({ message: error.message || 'Lỗi khi tạo đơn hàng' });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (order) {
      // Lỗi IDOR: Chỉ admin, staff hoặc chính chủ mới được xem
      if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin && !req.user.isStaff) {
        return res.status(401).json({ message: 'Không có quyền truy cập đơn hàng này' });
      }
      res.json(order);
    } else {
      res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Lỗi hệ thống' });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin && !req.user.isStaff) {
        return res.status(401).json({ message: 'Không có quyền cập nhật đơn hàng này' });
      }

      order.isPaid = true;
      order.paidAt = Date.now();
      // Nếu thanh toán qua VNPay/Stripe thì mới có các trường này, nếu thanh toán bằng tay (Admin click) thì gán mặc định
      order.paymentResult = req.body.id ? {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer?.email_address,
      } : { id: 'cash', status: 'completed', update_time: Date.now().toString() };

      const updatedOrder = await order.save();

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Lỗi hệ thống' });
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Lỗi hệ thống' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Lỗi hệ thống' });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Lỗi hệ thống' });
  }
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
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      if (order.user && order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
          return res.status(401).json({ message: 'Không có quyền hủy đơn hàng này' });
      }
      if (order.isDelivered && !req.user.isAdmin) {
          return res.status(400).json({ message: 'Không thể hủy đơn hàng đã giao' });
      }

      // Hoàn lại số lượng tồn kho
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, { $inc: { countInStock: item.qty } });
      }

      await Order.deleteOne({ _id: order._id });
      res.json({ message: 'Đã hủy đơn hàng thành công' });
    } else {
      res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Lỗi hệ thống' });
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
