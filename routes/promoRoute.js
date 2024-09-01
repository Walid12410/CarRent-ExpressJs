const router = require("express").Router();
const { getAllPromoCodeController,
    updatePromoCodeController,
    deleteOnePromoController,
    getOnePromoCodeController,
    createNewPromoController, 
    getPromoCodeController
} = require("../controller/PromeController");
const verifyEmployeeToken = require("../middlewares/EmployeeToken");
const validationObjectId = require("../middlewares/validateObjectID");
const { verfiyToken } = require("../middlewares/verifyToken");


// api/promo
router.route("/") 
      .get(getAllPromoCodeController)
      .post(verifyEmployeeToken, createNewPromoController);

// api/promo/:id
router.route("/:id")
      .get(validationObjectId, getOnePromoCodeController)
      .put(validationObjectId,verifyEmployeeToken , updatePromoCodeController)
      .delete(validationObjectId, verifyEmployeeToken , deleteOnePromoController);

// api/promo/claim
router.route("/claim")
      .post(verfiyToken, getPromoCodeController);

module.exports = router;