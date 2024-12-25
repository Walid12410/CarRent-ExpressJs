const router = require("express").Router();
const { NotificationForAllUserController,
    NotificationForOneUserController,
    getUserNotificationController,
    deleteUserNotificationsController
} = require("../controller/NotificationController");
const validationObjectId = require("../middlewares/validateObjectID");
const verifyEmployeeToken = require("../middlewares/verifyEmloyeeToken");
const {verfiyToken} = require("../middlewares/verifyToken");


// /api/notification/user-notification
router.route("/user-notification")
    .get(verfiyToken, getUserNotificationController)
    .delete(verfiyToken, deleteUserNotificationsController);

// /api/notification/send-notification-to-users
router.route("/send-notification-to-users")
    .post(verifyEmployeeToken,NotificationForAllUserController);

// /api/notification/send-notification-to-user/:id
router.route("/send-notification-to-user/:id")
    .post(validationObjectId,verifyEmployeeToken,NotificationForOneUserController);

module.exports = router;