const ReviewModel = require('../models/reviewModel');

exports.addReview = async (req, res) => {
    try {
        const { userId, vehicleId, rating, comment } = req.body;
        const review = await ReviewModel.addReview({ userId, vehicleId, rating, comment });
        res.redirect(`/vehicles/${vehicleId}#reviews`);
    } catch (error) {
        res.status(500).json({ message: "Failed to add review due to server error." });
    }
};

exports.getVehicleReviews = async (req, res) => {
    try {
        const { vehicleId } = req.params;
        const reviews = await ReviewModel.getReviewsByVehicle(vehicleId);
        res.render('vehicles/reviews', { reviews });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve reviews." });
    }
};