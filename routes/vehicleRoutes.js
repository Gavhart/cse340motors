const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.post('/reviews/add', reviewController.addReview);
router.get('/vehicles/:vehicleId/reviews', reviewController.getVehicleReviews);

module.exports = router;