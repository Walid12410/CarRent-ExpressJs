const router = require("express").Router();
const { getActiveOffersController,
    createOfferController,
    getOneOfferController,
    updateOfferController,
    deleteOfferController,
    getAllOfferController
} = require("../controller/OfferController");
const validationObjectId = require("../middlewares/validateObjectID");
const verifyEmployeeToken = require("../middlewares/EmployeeToken");



// /api/offer
router.route("/")
    .get(getActiveOffersController);


// /api/offer/all-offer
router.route("/all-offer")
    .get(getAllOfferController);


// /api/offer/:id
router.route("/:id")
    .get(validationObjectId, getOneOfferController)
    .post(validationObjectId, verifyEmployeeToken, createOfferController)
    .put(validationObjectId, verifyEmployeeToken, updateOfferController)
    .delete(validationObjectId, verifyEmployeeToken, deleteOfferController);


module.exports = router;