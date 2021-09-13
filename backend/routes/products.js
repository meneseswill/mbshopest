const express = require('express')
const path = require('path')
const multer = require('multer')
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/products')

const { protect, authorized } = require('../Middleware/auth')

// Incluir otroas rutas
const reviewRouter = require('./reviews')

const advancedResults = require('../Middleware/advancedResults')
const Products = require('../models/Products')

const router = express.Router()

// Redirigir a otras rutas
router.use('/:productId/reviews', reviewRouter)

// Subir producto
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    )
  },
})

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/
  //   Esto devuelve True or False
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (extname && mimetype) {
    return cb(null, true)
  } else {
    cb('Solo imágenes!')
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  },
})

router
  .route('/')
  .get(
    advancedResults(Products, { path: 'user', select: 'name email' }),
    getProducts
  )
  .post(
    protect,
    authorized('admin', 'publisher'),
    upload.single('image'),
    createProduct
  )
router
  .route('/:id')
  .get(getProduct)
  .put(
    protect,
    authorized('admin', 'publisher'),
    upload.single('image'),
    updateProduct
  )
  .delete(protect, authorized('admin', 'publisher'), deleteProduct)

// Exportando modulo
module.exports = router
