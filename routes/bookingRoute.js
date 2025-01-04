const router = require("express").Router();
const { createBookingController, 
    updateBookingController,
    deleteBookingController,
    getBookingUserController,
    getAllBookingController,
    getBookingCompanyController,
    countCompanyBookingController
} = require("../controller/BookingController");
const verifyEmployeeToken = require("../middlewares/verifyEmloyeeToken");
const validationObjectId = require("../middlewares/validateObjectID");
const { verfiyTokenAndOnlyUser,
    verfiyTokenAndAuthorization,
    verfiyToken
} = require("../middlewares/verifyToken");



// api/booking/:id
router.route("/:id")
    .post(validationObjectId, verfiyToken, createBookingController)
    .put(validationObjectId, verfiyToken, updateBookingController)
    .delete(validationObjectId, verfiyTokenAndAuthorization, deleteBookingController)
    .get(validationObjectId, verfiyTokenAndAuthorization, getBookingUserController);


// api/booking/company
router.route("/company/:id").get(verifyEmployeeToken, getBookingCompanyController);

// api/booking/company-count
router.route("/company-count/:id").get(verifyEmployeeToken, countCompanyBookingController);

// api/booking
router.route("/").get(verifyEmployeeToken, getAllBookingController);

// api/booking/:id
router.route("/:id")
    .delete(verifyEmployeeToken,deleteBookingController)
    .put(validationObjectId, verifyEmployeeToken , updateBookingController);


module.exports = router;