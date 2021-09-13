const express = require('express')

const { register, login, getMe , updateDetails, updatePassword} = require('../controllers/auth')
const {protect, authorized} = require('../Middleware/auth')


const router = express.Router()
router.route('/register').post(register)
router.route('/login').post(login)
router.route('/me').get(protect, getMe)
router.route('/updatedetails').put(protect ,authorized('user', 'publisher', 'admin'),updateDetails )
router.route('/updatepassword').put(protect, authorized('user', 'publisher', 'admin'), updatePassword)
// Exportando modulo
module.exports = router