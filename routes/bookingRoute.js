const router = require("express").Router();
const { createBookingController, 
    updateBookingController,
    deleteBookingController,
    getBookingUserController,
    getAllBookingController
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


// Employee route

// api/booking
router.route("/").get(verifyEmployeeToken, getAllBookingController);

// api/booking/:id
router.route("/:id")
    .delete(verifyEmployeeToken,deleteBookingController)
    .put(validationObjectId, verifyEmployeeToken , updateBookingController);


module.exports = router;