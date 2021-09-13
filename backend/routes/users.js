const express = require('express')
const {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/users')
const User = require('../models/User')

const { protect, authorized } = require('../Middleware/auth')
const advancedResults = require('../Middleware/advancedResults')

const router = express.Router()
router.use(protect)
router.use(authorized('admin'))
router.route('/').get(advancedResults(User), getUsers).post(createUser)
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser)

// Exportando modulo
module.exports = router
