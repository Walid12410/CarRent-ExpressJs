const router = require("express").Router();
const { getAllCarMakeController,
    createNewCarMakeController,
    updateCarMakeController,
    deleteCarMakeController
} = require("../controller/CarMakeController");
const validationObjectId = require("../middlewares/validateObjectID");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");


// /api/car-make
router.route("/")
    .get(getAllCarMakeController)
    .post(verifyTokenAndAdmin, createNewCarMakeController);


// /api/car-make/:id
router.route("/:id")
    .put(validationObjectId, verifyTokenAndAdmin, updateCarMakeController)
    .delete(validationObjectId, verifyTokenAndAdmin, deleteCarMakeController);


module.exports = router;