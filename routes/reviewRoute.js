const router = require("express").Router();
const { createReviewController,
    getAllCarReviewController,
    updateReviewController,
    deleteReviewController,
    getAllUserReviewController
} = require("../controller/ReviewController");
const validationObjectId = require("../middlewares/validateObjectID");
const { verfiyTokenAndAuthorization,
    verfiyToken , verfiyTokenAndOnlyUser
} = require("../middlewares/verifyToken");


// /api/review/:id
router.route("/:id")
    .get(validationObjectId, getAllCarReviewController)
    .post(validationObjectId, verfiyToken, createReviewController)
    .put(validationObjectId, verfiyToken, updateReviewController)
    .delete(validationObjectId, verfiyTokenAndAuthorization, deleteReviewController);


// /api/review/user-review/:id
router.route("/user-review/:id")
    .get(validationObjectId, verfiyTokenAndOnlyUser, getAllUserReviewController)


module.exports = router;