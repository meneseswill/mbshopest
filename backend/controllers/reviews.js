const Review = require('../models/Review')
const Product = require('../models/Products')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../Middleware/async')
const { remove } = require('../models/Review')

// @desc Obtener todas las revisioones de un producto en especifico
// @route GET api/v1/reviews
// @route GET api/v1/products/productId/reviews
// @access Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.productId) {
    const reviews = await Review.find({ product: req.params.productId })
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    })
  } else {
    res.status(200).json(res.advancedResults)
  }
})

// @desc Obtener una revision
// @route GET api/v1/reviews/:id
// @access Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id)
  if (!review) {
    return next(
      new ErrorResponse(
        `No se encontro el recurso con el id : ${req.params.id}`,
        404
      )
    )
  }

  res.status(200).json({
    success: true,
    count: review.length,
    data: review,
  })

  res.status(200).json(review)
})

// @desc Crear Revision
// @route POST api/v1/products/:productId/reviews
// @access Private
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.product = req.params.productId
  req.body.user = req.user.id

  const product = await Product.findById(req.params.productId)

  if (!product) {
    return next(
      ErrorResponse(
        `No se encontro un produto con el id ${req.params.productId}`,
        404
      )
    )
  }

  const review = await Review.create(req.body)

  res.status(201).json({ success: true, data: review })
})

// @desc Actualizar Revision
// @route PUT api/v1/reviews/:id
// @access Privaate
exports.updateReviews = asyncHandler(async (req, res, next) => {
    let review = await Review.findById(req.params.id)
    // console.log(product)
  
    if (!review) {
      return next(
        new ErrorResponse(
          `No se encontro el recurso con el id : ${req.params.id}`
        )
      )
    }
  
    // Asegurar que el usuario es el propietario de la revision
    if (req.user.id !== review.user.toString() && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          'El usuario no esta autorizado para actualizar esta revision',
          401
        )
      )
    }
    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    res.status(200).json({ success: true, data: review })
  })

// @desc Eliminar Revision
// @route DELETE api/v1/reviews/:id
// @access Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
    let review = await Review.findById(req.params.id)
  
    if (!review) {
        return next(
            new ErrorResponse(
              'El usuario no esta autorizado para eliminar esta revision',
              401
            )
          )
    }
  
    // Asegurar que el usuario es el propietario del producto
    if (req.user.id !== review.user.toString() && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          'El usuario no esta autorizado para eliminar esta revision',
          401
        )
      )
    }
  
    review.remove()
    res.status(200).json({ success: true, data: {} })
  })