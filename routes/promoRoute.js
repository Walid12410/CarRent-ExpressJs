const router = require("express").Router();
const { getAllPromoCodeController,
    updatePromoCodeController,
    deleteOnePromoController,
    getOnePromoCodeController,
    createNewPromoController 
} = require("../controller/PromeController");
const verifyEmployeeToken = require("../middlewares/EmployeeToken");
const validationObjectId = require("../middlewares/validateObjectID");


// api/promo
router.route("/") 
      .get(getAllPromoCodeController)
      .post(verifyEmployeeToken, createNewPromoController);

// api/promo/:id
router.route("/:id")
      .get(validationObjectId, getOnePromoCodeController)
      .put(validationObjectId,verifyEmployeeToken , updatePromoCodeController)
      .delete(validationObjectId, verifyEmployeeToken , deleteOnePromoController);


module.exports = router;