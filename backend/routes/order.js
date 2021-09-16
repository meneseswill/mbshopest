const express = require('express')
const {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
} = require('../controllers/orders')
const { protect, authorized } = require('../Middleware/auth')

const router = express.Router()

router
  .route('/')
  .post(protect, authorized('user', 'admin', 'publisher'), createOrder)
  .get(protect, authorized('admin'), getOrders)
router
  .route('/myorders')
  .get(protect, authorized('user', 'admin', 'publisher'), getMyOrders)
router
  .route('/:id')
  .get(protect, authorized('user', 'admin', 'publisher'), getOrderById)
router
  .route('/:id/pay')
  .put(protect, authorized('user', 'admin', 'publisher'), updateOrderToPaid)
router
  .route('/:id/deliver')
  .put(protect, authorized('admin'), updateOrderToDelivered)
// Exportando modulo
module.exports = router
