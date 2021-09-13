const Products = require('../models/Products')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../Middleware/async')
const fs = require('fs')

// @desc Obtener todas los productos
// @route GET api/v1/products
// @access Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  // return next(new ErrorResponse('Error provocado', 400))
  res.status(200).json(res.advancedResults)
})
// @desc Obtener un productos
// @route GET api/v1/products/:id
// @access Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Products.findById(req.params.id)

  if (!product) {
    return next(
      new ErrorResponse(
        `No se encontro el recurso con el id: ${req.params.id}`,
        404
      )
    )
  }

  res.status(200).json({ success: true, data: product })
})

// @desc Agregar productos
// @route POST api/v1/products
// @access Private/admin
exports.createProduct = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id
  if (req.file && req.file.path) {
    req.body.image = '/' + req.file.path
  } else {
    delete req.body.image
  }

  const product = await Products.create(req.body)

  res.status(201).json({ success: true, data: product })
})

// @desc Actualizar productos
// @route PUT api/v1/products/:id
// @access Private/admin
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Products.findById(req.params.id)

  if (!product) {
    return next(
      new ErrorResponse(
        `No se encontró el recurso con el id : ${req.params.id}`
      )
    )
  }

  // Asegurar que el usuario es el propietario del producto
  if (req.user.id !== product.user.toString() && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        'El usuario no esta autorizado para actualizar ese producto',
        401
      )
    )
  }

  if (req.file && req.file.path) {
    req.body.image = '/' + req.file.path
    try {
      fs.unlinkSync(product.image.substring(1))
    } catch (err) {
      console.log(err)
    }
  } else {
    delete req.body.image
  }

  product = await Products.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  res.status(200).json({ success: true, data: product })
})

// @desc Eliminar un productos
// @route DELETE api/v1/products/:id
// @access Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  let product = await Products.findById(req.params.id)

  if (!product) {
    return res.status(404).json({ success: false })
  }

  // Asegurar que el usuario es el propietario del producto
  if (req.user.id !== product.user.toString() && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        'El usuario no esta autorizado para eliminar ese producto',
        401
      )
    )
  }

  product.remove()
  res.status(200).json({ success: true, data: {} })
})
