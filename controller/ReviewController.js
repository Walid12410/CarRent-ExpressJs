const asyncHandler = require("express-async-handler");
const { Review,
    validationCreateReview,
    validationUpdateReview
} = require("../model/Review");
const { CarRent } = require("../model/CarRent");


/**
 * @desc Create new Review
 * @Route /api/review/:id
 * @method POST
 * @access private (only User himself)
 */
module.exports.createReviewController = asyncHandler(async (req, res) => {
    const { error } = validationCreateReview(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const carFound = await CarRent.findOne({ _id: req.params.id });
    if (!carFound) {
        return res.status(404).json({ message: "Car not found" });
    }

    const reviewAlready = await Review.findOne({ userId: req.user.id, carId: req.params.id });
    if (reviewAlready) {
        return res.status(400).json({ message: "You already reviewed this car before." });
    }

    const review = new Review({
        userId: req.user.id,
        carId: req.params.id,
        rate: req.body.rate,
        reviewText: req.body.reviewText
    });

    await review.save();

    res.status(201).json({ message: 'Review added to this car successfully' });
});



/**
 * @desc Get all Reviews for a Car
 * @Route /api/review/:id
 * @method GET
 * @access public
 */
module.exports.getAllCarReviewController = asyncHandler(async (req, res) => {
    const carReviews = await Review.find({ carId: req.params.id });
    if (carReviews.length > 0) {
        res.status(200).json(carReviews);
    } else {
        res.status(404).json({ message: "No reviews for this car yet" });
    }
});


/**
 * @desc Get one review for user by carId
 * @Route /api/user-review/:id
 * @method GET
 * @access private(only user)
 */
module.exports.getAllUserReviewController = asyncHandler(async (req, res) => {
    const review = await Review.find({ userId: req.user.id });
    res.status(200).json(review);
});


/**
 * @desc Update Reviews for a Car
 * @Route /api/review/:id
 * @method PUT
 * @access private (only user HimeSelf)
 */
module.exports.updateReviewController = asyncHandler(async (req, res) => {
    const { error } = validationUpdateReview(req.body);
    if (error) {
        return res.status(400).json(error.details[0].message);
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
        return res.status(404).json({ message: "Review not found" });
    }

    if (review.userId.toString() !== req.user.id) {
        return res.status(403).json({ message: "You do not have permission to update this review" });
    }

    const updateReview = await Review.findByIdAndUpdate(req.params.id, {
        $set: {
            rate: req.body.rate,
            reviewText: req.body.reviewText
        }
    }, { new: true });

    res.status(201).json(updateReview);
});


/**
 * @desc Delete Reviews for a Car
 * @Route /api/review/:id
 * @method Delete
 * @access private (only user HimeSelf or Admin)
 */
module.exports.deleteReviewController = asyncHandler(async (req, res) => {
    const reviewFound = await Review.findById(req.params.id);
    if (!reviewFound) {
        return res.status(404).json({ message: "Review not found" });
    }

    if (reviewFound.userId.toString() !== req.user.id && !req.user.isAdmin) {
        return res.status(403).json({ message: "You do not have permission to delete this review" });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Review deleted successfully" });
});


