const router = require("express").Router();
const { getAllPromoCodeController,
    updatePromoCodeController,
    deleteOnePromoController,
    getOnePromoCodeController,
    createNewPromoController,
    uploadPromoImage,
} = require("../controller/PromeController");
const validationObjectId = require("../middlewares/validateObjectID");
const { verfiyToken, verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const { usePromoCodeController, checkPromoCodeController, getPromoCodeController } = require("../controller/GetPromoController");
const photoUpload = require("../middlewares/uploadProfilePhoto");


// api/promo
router.route("/")
    .get(getAllPromoCodeController)
    .post(verifyTokenAndAdmin, photoUpload.single("image"), createNewPromoController);

// api/promo/:id
router.route("/:id")
    .get(validationObjectId, getOnePromoCodeController)
    .put(validationObjectId, verifyTokenAndAdmin, updatePromoCodeController)
    .delete(validationObjectId, verifyTokenAndAdmin, deleteOnePromoController);

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
    .post(validationObjectId, verifyTokenAndAdmin, photoUpload.single("image"), uploadPromoImage);


module.exports = router;