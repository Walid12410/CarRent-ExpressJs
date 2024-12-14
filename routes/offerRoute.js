const router = require("express").Router();
const { getActiveOffersController,
    createOfferController,
    getOneOfferController,
    updateOfferController,
    deleteOfferController,
    countOfferController,
    checkCarIsOfferController,
} = require("../controller/OfferController");
const validationObjectId = require("../middlewares/validateObjectID");
const verifyEmployeeToken = require("../middlewares/verifyEmloyeeToken");



// /api/offer
router.route("/").get(getActiveOffersController);

// /api/offer/count
router.route("/count").get(countOfferController);

// /api/offer/check-car/:id
router.route("/check-car/:id").get(validationObjectId,checkCarIsOfferController);

// /api/offer/:id
router.route("/:id")
    .get(validationObjectId, getOneOfferController)
    .post(validationObjectId, verifyEmployeeToken, createOfferController)
    .put(validationObjectId, verifyEmployeeToken, updateOfferController)
    .delete(validationObjectId, verifyEmployeeToken, deleteOfferController);


module.exports = router;