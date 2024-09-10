const router = require("express").Router();
const { getAllOfferController,
    createOfferController,
    getOneOfferController,
    updateOfferController,
    deleteOfferController
} = require("../controller/OfferController");
const validationObjectId = require("../middlewares/validateObjectID");
const verifyEmployeeToken = require("../middlewares/EmployeeToken");
  


// /api/offer
router.route("/") 
.get(getAllOfferController);


// /api/offer/:id
router.route("/:id") 
.get(validationObjectId, getOneOfferController)
.post(validationObjectId,verifyEmployeeToken, createOfferController)
.put(validationObjectId, verifyEmployeeToken , updateOfferController)
.delete(validationObjectId , verifyEmployeeToken , deleteOfferController);


module.exports = router;