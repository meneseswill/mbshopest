const fs = require('fs')
const ErrorResponse = require('../utils/errorResponse')

const handleError = (err, req, res, next) => {
  console.log(err.stack)

  let error = {}
  error.statusCode = err.statusCode
  error.message = err.message

  let message

  // Error de validacion mongoDB
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors)

    for (let key in err.errors) {
      if (err.errors[key].kind === 'ObjectId') {
        message = `No se encontro el recurso con el id: ${err.errors[key].value}`
      } else if (err.errors[key].kind === 'enum') {
        message = `No se permite el valor: ${err.errors[key].value}`
      }
    }
    error = new ErrorResponse(message, 400)
  }

  // Campo dubplicado
  if (err.code === 11000) {
    message = 'Campo duplicado'
    error = new ErrorResponse(message, 400)
  }

  // castError id invalido
  if (err.name === 'CastError') {
    message = `No se encontro el recurso con el id: ${err.value}`
    error = new ErrorResponse(message, 404)
  }

  if (req.file && req.file.path) {
    try {
      fs.unlinkSync(req.file.path)
    } catch (err) {
      console.log(err)
    }
  }

  res
    .status(error.statusCode || 500)
    .json({ succes: false, error: error.message })
}

module.exports = handleError
