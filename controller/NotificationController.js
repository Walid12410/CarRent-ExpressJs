const asyncHandler = require("express-async-handler");
const { DeviceToken } = require("../model/DeviceToken");
const admin = require("../config/firebaseConfig"); // Import Firebase config
const { User } = require("../model/User");
const { validationCreateNotification, Notification } = require("../model/Notification");

/**
 * @desc send notification for all users
 * @Route /api/notification/send-notfication-to-usiers
 * @method POST
 * @access private (only Admin or employee)
*/
module.exports.NotificationForAllUserController = asyncHandler(async (req, res) => {
    // fetch all users
    const users = await User.find().select("-password");
    if (!users) {
        return res.status(400).json({ message: "No user found!" });
    }

    // validate the notification
    const { error } = validationCreateNotification(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    // Fetch all device tokens
    const devices = await DeviceToken.find();

    // Extract device tokens and user IDs
    const deviceTokens = [...new Set(devices.map(device => device.deviceToken))];
    const userIds = users.map(user => user.id);

    // Create notifications array for bulk insertion
    const notifications = userIds.map(userId => ({
        title: req.body.title,
        body: req.body.body,
        userId: userId, // Save individual user ID
    }));

    // Save all notifications in the database
    await Notification.insertMany(notifications);

    // Check if there are tokens to send notifications
    if (deviceTokens.length === 0) {
        return res.status(400).json({ message: "No device tokens available." });
    }

    // Prepare Firebase notification payload
    const message = {
        notification: {
            title: req.body.title,
            body: req.body.body,
        },
        tokens: deviceTokens, // Use tokens array
    };

    // Send the notification to all users using the correct method
    admin.messaging().sendEachForMulticast(message)
        .then((response) => {
            console.log("Notification sent to all users:", response);
            return res.status(200).json({
                message: "Notification sent and saved for all users.",
                response,
            });
        })
        .catch((error) => {
            console.error("Error sending notification:", error);
            return res.status(500).json({ message: "Failed to send notifications.", error });
        });
});


/**
 * @desc send notification for all users
 * @Route /api/notification/send-notification-to-user/:id
 * @method POST
 * @access private (only Admin or employee)
*/
module.exports.NotificationForOneUserController = asyncHandler(async (req, res) => {
    // Fetch user by ID
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {  // Check if user exists
        return res.status(400).json({ message: "User not found!" });
    }

    // Validate the notification
    const { error } = validationCreateNotification(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    // Save the notification in the database
    const notification = new Notification({
        title: req.body.title,
        body: req.body.body,
        userId: req.params.id
    });

    await notification.save();

    // Fetch the user's device token
    const device = await DeviceToken.findOne({ userId: req.params.id });
    if (!device) {
        return res.status(400).json({ message: "User does not allow notifications yet!" });
    }

    const deviceToken = device.deviceToken;

    // Prepare the message for Firebase
    const message = {
        notification: {  // Using notification field for simple push notification
            title: req.body.title,
            body: req.body.body
        },
        token: deviceToken
    };

    // Send the notification
    admin.messaging().send(message)
        .then((response) => {
            console.log("Notification sent successfully!", response);
            return res.status(200).json({ message: "Notification sent successfully!" });
        })
        .catch((error) => {
            console.log("Error sending notification!", error);
            return res.status(400).json({ message: "Error sending notification!" });
        });
});


/**
 * @desc Get all user notification
 * @Route /api/notification/user-notification
 * @method GET
 * @access private (only user)
*/
module.exports.getUserNotificationController = asyncHandler(async (req, res) => {
    const { pageNumber, limitPerPage } = req.query;
    const page = parseInt(pageNumber) || 1;
    const limit = parseInt(limitPerPage) || 10;
    const userId = req.user.id;
    const notifications = await Notification.find({ userId: userId })
        .skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 });
    res.status(200).json( notifications );
});


/**
 * @desc Get all user notification
 * @Route /api/notification/user-notification
 * @method DELETE
 * @access private (only user)
*/
module.exports.deleteUserNotificationsController = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const notifications = await Notification.deleteMany({ userId: userId });
    if (!notifications) {
        return res.status(400).json({ message: "No notification found!" });
    }
    res.status(200).json({ message: 'All notifications deleted successfully!' });
});