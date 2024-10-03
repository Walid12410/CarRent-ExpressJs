const router = require("express").Router();
const {getAllPromoCodeController,
    updatePromoCodeController,
    deleteOnePromoController,
    getOnePromoCodeController,
    createNewPromoController,
    uploadPromoImage, 
} = require("../controller/PromeController");
const verifyEmployeeToken = require("../middlewares/EmployeeToken");
const validationObjectId = require("../middlewares/validateObjectID");
const { verfiyToken, verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const { usePromoCodeController, checkPromoCodeController, getPromoCodeController } = require("../controller/GetPromoController");
const photoUpload = require("../middlewares/uploadProfilePhoto");
  

// api/promo
router.route("/") 
.get(getAllPromoCodeController)
.post(verifyTokenAndAdmin, createNewPromoController);

// api/promo/:id
router.route("/:id")
.get(validationObjectId, getOnePromoCodeController)
.put(validationObjectId,verifyEmployeeToken , updatePromoCodeController)
.delete(validationObjectId, verifyEmployeeToken , deleteOnePromoController);

// api/promo/claim
router.route("/claim")
.post(verfiyToken, getPromoCodeController);

// api/promo/use
router.route("/use")
.post(verfiyToken, usePromoCodeController);

//api/promo/user-promotion
router.route("/check-user-promotion")
.post(verfiyToken, checkPromoCodeController);

//api/promo/upload-image/:id
router.route("/upload-image/:id")
.post(validationObjectId,verifyEmployeeToken,photoUpload.single("image"), uploadPromoImage);


module.exports = router;