const router = require("express").Router();
const { createReviewController,
    getAllCarReviewController,
    updateReviewController,
    deleteReviewController
} = require("../controller/ReviewController");
const validationObjectId = require("../middlewares/validateObjectID");
const {verfiyTokenAndAuthorization,
    verfiyToken
} = require("../middlewares/verifyToken");
  

// /api/review/:id
router.route("/:id") 
.get(validationObjectId, getAllCarReviewController)
.post(validationObjectId,verfiyToken, createReviewController)
.put(validationObjectId, verfiyToken , updateReviewController)
.delete(validationObjectId , verfiyTokenAndAuthorization , deleteReviewController);


module.exports = router;