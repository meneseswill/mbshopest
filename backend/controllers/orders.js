const Order = require('../models/Order')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../Middleware/async')

// @desc Crear una orden
// @route POST /api/v1/orders
// @access Private
exports.createOrder = asyncHandler(async (req, res, next) => {
  if (!req.body.orderItems || !req.body.orderItems.length > 0) {
    return next(
      new ErrorResponse('Se require como minimo la orden de un producto', 400)
    )
  }
  req.body.user = req.user.id

  const order = await Order.create(req.body)

  res.status(201).json({ success: true, data: order })
})

// @desc    Obtener orden por ID
// @route   GET /api/v1/orders/:id
// @access  Private
exports.getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  )

  if (!order) {
    return next(
      new ErrorResponse(
        `No se encontró el recurso con el id: ${req.params.id}`,
        404
      )
    )
  }

  res.status(200).json({ success: true, data: order })
})

// @desc    Actualizar la orden a pagada
// @route   PUT /api/v1/orders/:id/pay
// @access  Private
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)

  if (!order) {
    return next(
      new ErrorResponse(
        `No se encontró el recurso con el id: ${req.params.id}`,
        404
      )
    )
  } else {
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    }
  }

  const updateOrder = await order.save()

  res.status(200).json({ success: true, data: updateOrder })
})

// @desc    Obtener órdenes del usuario actual
// @route   GET /api/v1/orders/myorders
// @access  Private
exports.getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id })

  res.status(200).json({ success: true, data: orders })
})
