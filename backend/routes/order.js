const express = require('express')
const {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
} = require('../controllers/orders')
const { protect, authorized } = require('../Middleware/auth')

const router = express.Router()

router
  .route('/')
  .post(protect, authorized('user', 'admin', 'publisher'), createOrder)
router
  .route('/myorders')
  .get(protect, authorized('user', 'admin', 'publisher'), getMyOrders)
router
  .route('/:id')
  .get(protect, authorized('user', 'admin', 'publisher'), getOrderById)

router
  .route('/:id/pay')
  .put(protect, authorized('user', 'admin', 'publisher'), updateOrderToPaid)
// Exportando modulo
module.exports = router
