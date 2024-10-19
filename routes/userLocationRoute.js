const router = require("express").Router();
const { createNewUserLocationController,
    updateUserLocationController,
    getUserLocationController,
    deleteUserLocationController
} = require("../controller/UserLocationController");
const validationObjectId = require("../middlewares/validateObjectID");
const { verfiyToken } = require("../middlewares/verifyToken");

// api/user-location/:id
router.route("/:id")
    .post(validationObjectId, verfiyToken, createNewUserLocationController)
    .put(validationObjectId, verfiyToken, updateUserLocationController)
    .delete(validationObjectId, verfiyToken, deleteUserLocationController)
    .get(validationObjectId, getUserLocationController);



module.exports = router;