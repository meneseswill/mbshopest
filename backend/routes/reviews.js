const express = require('express')
const {addReview, getReviews,getReview , updateReviews, deleteReview} = require('../controllers/reviews')

const { protect, authorized } = require('../Middleware/auth')
const advancedResults = require('../Middleware/advancedResults')
const Review = require('../models/Review')

const router = express.Router({ mergeParams: true})

router.route('/').post(protect, authorized('admin', 'user'), addReview)
.get(advancedResults(Review,{path: 'user' , select: 'name email'}),getReviews)


router.route('/:id').get(getReview).put(protect , authorized('admin', 'user'), updateReviews ).delete(protect , authorized('admin', 'user'),deleteReview)
// Exportando modulo
module.exports = router
