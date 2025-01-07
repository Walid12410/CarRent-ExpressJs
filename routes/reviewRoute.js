const router = require("express").Router();
const { createReviewController,
    getAllCarReviewController,
    updateReviewController,
    deleteReviewController,
    getAllUserReviewController,
    getCompanyReviewController,
    countCompanyReviewController,
    countReviewController,
    getAllReviewController
} = require("../controller/ReviewController");
const validationObjectId = require("../middlewares/validateObjectID");
const { verfiyTokenAndAuthorization,
    verfiyToken , verfiyTokenAndOnlyUser
} = require("../middlewares/verifyToken");
const verifyEmployeeToken = require("../middlewares/verifyEmloyeeToken");



// /api/review/car-review
router.route("/car-review")
    .get(verfiyTokenAndAuthorization,getAllReviewController);

// /api/review/car-review/count
router.route("/car-review/count")
    .get(verfiyTokenAndAuthorization,countReviewController);

// /api/review/:id
router.route("/:id")
    .get(validationObjectId, getAllCarReviewController)
    .post(validationObjectId, verfiyToken, createReviewController)
    .put(validationObjectId, verfiyToken, updateReviewController)
    .delete(validationObjectId, verfiyTokenAndAuthorization, deleteReviewController);

// /api/review/user-review/:id
router.route("/user-review/:id")
    .get(validationObjectId, verfiyTokenAndOnlyUser, getAllUserReviewController)

// /api/review/company-review/:id
router.route("/company-review/:id")
    .get(validationObjectId, verifyEmployeeToken, getCompanyReviewController);

// /api/review/company-review/count/:id
router.route("/company-review/count/:id")
    .get(validationObjectId, verifyEmployeeToken, countCompanyReviewController);


module.exports = router;