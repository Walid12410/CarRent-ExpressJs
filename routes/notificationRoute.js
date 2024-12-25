const router = require("express").Router();
const { NotificationForAllUserController, NotificationForOneUserController
} = require("../controller/NotificationController");
const validationObjectId = require("../middlewares/validateObjectID");
const verifyEmployeeToken = require("../middlewares/verifyEmloyeeToken");



// /api/notification/send-notification-to-users
router.route("/send-notification-to-users")
    .post(verifyEmployeeToken,NotificationForAllUserController);


// /api/notification/send-notification-to-user/:id
router.route("/send-notification-to-user/:id")
    .post(validationObjectId,verifyEmployeeToken,NotificationForOneUserController);

module.exports = router;