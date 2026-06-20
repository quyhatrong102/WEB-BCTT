import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
} from '../controllers/productController.js';
import { protect, admin, adminOrStaff } from '../middleware/authMiddleware.js';

router.route('/').get(getProducts).post(protect, adminOrStaff, createProduct);
router
  .route('/:id')
  .get(getProductById)
  .delete(protect, adminOrStaff, deleteProduct)
  .put(protect, adminOrStaff, updateProduct);

export default router;
