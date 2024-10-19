const router = require("express").Router();
const {
    createNewFeatureController,
    getAllFeatureController,
    updateFeatureController,
    deleteFeatureController
} = require("../controller/FeatureController");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const validationObjectId = require("../middlewares/validateObjectID");


// api/feature/:id
router.route("/:id")
    .post(validationObjectId, verifyTokenAndAdmin, createNewFeatureController)
    .put(validationObjectId, verifyTokenAndAdmin, updateFeatureController)
    .delete(validationObjectId, verifyTokenAndAdmin, deleteFeatureController);

// api/feature/
router.route("/")
    .get(getAllFeatureController);


module.exports = router;