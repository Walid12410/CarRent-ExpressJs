const router = require("express").Router();
const { deviceTokenController } = require("../controller/DeviceTokenController");
const { verfiyToken } = require("../middlewares/verifyToken");



// api/device-token
router.route("/").post(verfiyToken, deviceTokenController);


module.exports = router;