const router = require("express").Router();
const {createCarRentController,
    getAllCarRentController,
    getOneCarRentController,
    updateOneCarRentController,
    deleteCarRentController,
    countAllCarRentController,
    AddCarImagesController
} = require("../controller/carRentController");
const verifyEmployeeToken = require("../middlewares/EmployeeToken");
const validationObjectId = require("../middlewares/validateObjectID");
const photoUpload = require("../middlewares/uploadProfilePhoto");

// api/car-rent/count
router.route("/count")
.get(countAllCarRentController);

// api/car-rent
router.route("/") 
.get(getAllCarRentController)
.post(verifyEmployeeToken, createCarRentController);

// api/car-rent/:id
router.route("/:id")
.get(validationObjectId, getOneCarRentController)
.put(validationObjectId,verifyEmployeeToken , updateOneCarRentController)
.delete(validationObjectId, verifyEmployeeToken , deleteCarRentController);


router.post('/car-image/:id',validationObjectId,verifyEmployeeToken, photoUpload.array('carImages', 5), AddCarImagesController);

module.exports = router;