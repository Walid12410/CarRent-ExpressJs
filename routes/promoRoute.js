const router = require("express").Router();
const { getAllPromoCodeController,
    updatePromoCodeController,
    deleteOnePromoController,
    getOnePromoCodeController,
    createNewPromoController,
    uploadPromoImage,
} = require("../controller/PromeController");
const validationObjectId = require("../middlewares/validateObjectID");
const { verfiyToken } = require("../middlewares/verifyToken");
const { usePromoCodeController, checkPromoCodeController, getPromoCodeController } = require("../controller/GetPromoController");
const photoUpload = require("../middlewares/uploadProfilePhoto");
const verifyEmployeeToken = require("../middlewares/EmployeeToken");


// api/promo
router.route("/")
    .get(getAllPromoCodeController)
    .post(verifyEmployeeToken, photoUpload.single("image"), createNewPromoController);


// api/promo/:id
router.route("/:id")
    .get(validationObjectId, getOnePromoCodeController)
    .put(validationObjectId, verifyEmployeeToken, updatePromoCodeController)
    .delete(validationObjectId, verifyEmployeeToken, deleteOnePromoController);

// api/promo/claim
router.route("/claim/:id").post(validationObjectId, verfiyToken, getPromoCodeController);

// api/promo/use
router.route("/use").post(verfiyToken, usePromoCodeController);

//api/promo/user-promotion
router.route("/check-user-promotion/:id").post(verfiyToken, checkPromoCodeController);

//api/promo/upload-image/:id
router.route("/upload-image/:id")
    .post(validationObjectId, verifyEmployeeToken, photoUpload.single("image"), uploadPromoImage);


module.exports = router;