import express from 'express';
const router = express.Router();
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  getOrderStats,
  deleteMyOrder,
} from '../controllers/orderController.js';
import { protect, admin, adminOrStaff } from '../middleware/authMiddleware.js';

router.route('/').post(protect, addOrderItems).get(protect, adminOrStaff, getOrders);
router.route('/stats').get(protect, adminOrStaff, getOrderStats);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById).delete(protect, deleteMyOrder);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, adminOrStaff, updateOrderToDelivered);

export default router;
