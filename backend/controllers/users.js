const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../Middleware/async')

// @desc Obtener todas los Usuarios
// @route GET api/v1/auth/users
// @access Private
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

// @desc Obtener un  usuario
// @route GET api/v1/auth/:id
// @access Private
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return next(
      new ErrorResponse(
        `No se encontro el recurso con el id: ${req.params.id}`,
        404
      )
    )
  }

  res.status(200).json({ success: true, data: user })
})

// @desc Agregar usuarios
// @route POST api/v1/auth/users
// @access Private/admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body)

  res.status(201).json({ success: true, data: user })
})

// @desc Actualizar Usuario
// @route PUT api/v1/auth/:id
// @access Private/ admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  let user = await User.findByIdAndUpdate(req.params.id, req.body , {
      new: true,
      runValidators : true
  })
  // console.log(product)

  if (!user) {
    return next(
      new ErrorResponse(
        `No se encontro el recurso con el id : ${req.params.id}`
      )
    )
  }

  res.status(200).json({ success: true, data: user })
})

// @desc Eliminar Usuario
// @route DELETE api/v1/auth/:id
// @access Private/admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return next(
        new ErrorResponse(
          `No se encontro el recurso con el id : ${req.params.id}`
        )
      )
  }
  await user.remove()
  
  res.status(200).json({ success: true, data: {} })
})
