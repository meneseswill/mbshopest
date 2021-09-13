const User = require('../models/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../Middleware/async')

// @desc Registrar Usuario
// @route POST api/v1/auth/register
// @access Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body

  // Crear usuario
  const user = await User.create({
    name,
    email,
    password,
    role,
  })

  sendTokenResponse(user, 200, res)
})

// @desc Iniciar Sesion
// @route POST api/v1/auth/login
// @access Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  // Validar Email y password
  if (!email || !password) {
    return next(
      new ErrorResponse(
        'Por favor introduce un correo y contraseña valido',
        400
      )
    )
  }

  // Verificar user
  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    return next(new ErrorResponse('Credenciales no validas', 401))
  }

  // Verificar password que coincida con la almacenada en la BD
  const isMatch = await user.matchPassword(password)

  if (!isMatch) {
    return next(new ErrorResponse('Credenciales no validas', 401))
  }

  sendTokenResponse(user, 200, res)
})

// Metodo para enviar token y generar cookie
const sendTokenResponse = (user, statusCode, res) => {
  // Crear token

  const token = user.getSignedJwtToken()

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  }

  if (process.env.NODE_ENV == 'production') {
    options.secure = true
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token })
}

// @desc Obtener informacion del usuario actual
// @route POST api/v1/auth/me
// @access Private

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id)
  res.status(200).json({ succes: true, data: user })
})

// @desc actualizar detalles  del usuario actual
// @route PUT api/v1/auth/updatedetails
// @access Private

exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  }

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({ succes: true, data: user })
})

// @desc actualizar contrasena  del usuario actual
// @route PUT api/v1/auth/updatepassword
// @access Private

exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password')

  // Verificar la contrsena actual
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('La contraseña actual es incorrecta', 401))
  }

  if (!req.body.newPassword) {
    return next(new ErrorResponse('Ingrese la nueva contraseña', 400))
  }

  user.password = req.body.newPassword

  await user.save()
  sendTokenResponse(user, 200, res)
  // res.status(200).json({succes: true , data: user})
})
