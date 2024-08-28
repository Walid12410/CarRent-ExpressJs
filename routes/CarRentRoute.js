const router = require("express").Router();
const {createCarRentController,
    getAllCarRentController,
    getOneCarRentController,
    updateOneCarRentController,
    deleteCarRentController,
    countAllCarRentController
} = require("../controller/carRentController");
const verifyEmployeeToken = require("../middlewares/EmployeeToken");
const validationObjectId = require("../middlewares/validateObjectID");
const photoUpload = require("../middlewares/uploadProfilePhoto");


// api/car-rent
router.route("/") 
      .get(getAllCarRentController)
      .post(verifyEmployeeToken, createCarRentController);

// api/user/profile
router.route("/:id")
      .get(validationObjectId, getOneCarRentController)
      .put(validationObjectId,verifyEmployeeToken , updateOneCarRentController)
      .delete(validationObjectId, verifyEmployeeToken , deleteCarRentController);

// api/car-rent/count
router.route("/count")
      .get(countAllCarRentController);



module.exports = router;