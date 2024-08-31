const router = require("express").Router();
const {getAllUserController,
      getOneUserController,
      updateUserController,
      countUserController, 
      uploadUserProfileImage} = require("../controller/userController");
const {verifyTokenAndAdmin, verfiyTokenAndOnlyUser, verfiyToken} = require("../middlewares/verifyToken");
const validationObjectId = require("../middlewares/validateObjectID");
const photoUpload = require("../middlewares/uploadProfilePhoto");


// api/user/profile
router.route("/profile")
      .get(verifyTokenAndAdmin , getAllUserController);

// api/user/profile
router.route("/profile/:id")
      .get(validationObjectId, getOneUserController)
      .put(validationObjectId, verfiyTokenAndOnlyUser, updateUserController);

// api/user/count
router.route("/count")
      .get(verifyTokenAndAdmin , countUserController);

// api/user/profile/upload-image
router.route("/profile/upload-image")
      .post(verfiyToken,photoUpload.single("image"),uploadUserProfileImage);


module.exports = router;