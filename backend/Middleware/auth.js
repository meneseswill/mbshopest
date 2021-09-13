const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('./async')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

exports.protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(
      new ErrorResponse('No esta autorizado para acceder a esta ruta', 401)
    )
  }

  try {
    const decoded = jwt.decode(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)

    req.user = user

    next()
  } catch (err) {
    return next(
      new ErrorResponse('No esta autorizado para acceder a esta ruta', 401)
    )
  }
})

// exports.admin = asyncHandler(async(req, res ,next ) =>{
//     // console.log('admin')
//     console.log(req.user)
//     if(!req.user || !req.user.isAdmin){
//         return next(
//             new ErrorResponse('No esta autorizado para realizar esta accion', 401)
//         )
//     }
//     next()
// })

exports.authorized = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next(
        new ErrorResponse('No esta autorizado para acceder a esta ruta', 401)
      )
    }

    next()
  }
}
