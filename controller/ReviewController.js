const asyncHandler = require("express-async-handler");
const { Review,
    validationCreateReview,
    validationUpdateReview
} = require("../model/Review");
const { CarRent } = require("../model/CarRent");
const { mongoose } = require("mongoose");


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
    const { pageNumber, limitPerPage } = req.query;

    // Validate and parse page number and limit
    const page = parseInt(pageNumber, 10) || 1;
    const limit = parseInt(limitPerPage, 10) || 10;


    const pipelineAggregation = [
        { $match: { carId : new mongoose.Types.ObjectId(req.params.id) } }, // Match the reviews for the specified car
        {
            $lookup: {
                from: "users",
                localField: "userId", // Assuming 'userId' is the field in the 'reviews' collection
                foreignField: "_id",
                as: "user",
                pipeline: [
                    { $project: { password: 0 } } // Exclude password field
                ]
            }
        },
        {
            $unwind: {
                path: "$user",
                preserveNullAndEmptyArrays: true
            }
        },
        { $skip: (page - 1) * limit }, // Pagination: Skip documents for the previous pages
        { $limit: limit } // Pagination: Limit to the specified number per page
    ];

    const carReviews = await Review.aggregate(pipelineAggregation);
    return res.status(200).json(carReviews);
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


