const router = require("express").Router();
const { createCarRentController,
    getAllCarRentController,
    getOneCarRentController,
    updateOneCarRentController,
    deleteCarRentController,
    countAllCarRentController,
    AddCarImagesController,
    searchCarController,
    changeCarImageController
} = require("../controller/CarRentController");
const verifyEmployeeToken = require("../middlewares/verifyEmloyeeToken");
const validationObjectId = require("../middlewares/validateObjectID");
const photoUpload = require("../middlewares/uploadProfilePhoto");

// api/car-rent/count
router.route("/count")
    .get(countAllCarRentController);

// api/car-rent
router.route("/")
    .get(getAllCarRentController)
    .post(verifyEmployeeToken, createCarRentController);

// api/car-rent/search
router.route("/search").post(searchCarController);

// api/car-rent/:id
router.route("/:id")
    .get(validationObjectId, getOneCarRentController)
    .put(validationObjectId, verifyEmployeeToken, updateOneCarRentController)
    .delete(validationObjectId, verifyEmployeeToken, deleteCarRentController);

// api/car-rent/car-image/:id
router.post('/car-image/:id', validationObjectId, verifyEmployeeToken, photoUpload.array('carImages', 3), AddCarImagesController);

// api/car-rent/change-image/:id
router.post('/change-image/:id', validationObjectId, verifyEmployeeToken, photoUpload.single('carImages', 3), changeCarImageController);

module.exports = router;