const asyncHandler = require("express-async-handler");
const { User, validationUpdateUser } = require("../model/User");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");
const { cloudinaryUploadImage,
    cloudinaryRemoveImage,
    cloudinaryRemoveMultipleImage
} = require("../utils/cloudinary");

/**
 * @desc Select All User
 * @Route /api/user/profile
 * @method GET
 * @access private (only Admin)
*/
module.exports.getAllUserController = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password");
    res.status(200).json(users);
});


/**
 * @desc Select One User
 * @Route /api/user/profile/:id
 * @method GET
 * @access Public
*/
module.exports.getOneUserController = asyncHandler(async (req, res) => {
    const users = await User.findById(req.params.id).select("-password");
    if (users) {
        res.status(200).json(users);
    } else {
        res.status(404).json({ message: "User Not Found" });
    }
});


/**
 * @desc Update User Profile
 * @Route /api/user/profile/:id
 * @method PUT
 * @access private(only user himeself)
*/
module.exports.updateUserController = asyncHandler(async (req, res) => {
    const { error } = validationUpdateUser(req.body);
    if (error) {
        return res.status(404).json({ message: error.details[0].message });
    }

    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const updateUser = await User.findByIdAndUpdate(req.params.id, {
        $set: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumber: req.body.phoneNumber,
            password: req.body.password
        }
    }, { new: true }).select("-password");

    res.status(200).json(updateUser);
});

/**
 * @desc Count All User
 * @Route /api/user/count
 * @method GET
 * @access private(only Admin)
*/
module.exports.countUserController = asyncHandler(async (req, res) => {
    const userCount = await User.countDocuments();
    res.status(200).json({ count: userCount });
});

/**
 * @desc Select All User
 * @Route /api/user/profile
 * @method POST
 * @access private (only user him self)
*/
module.exports.uploadUserProfileImage = asyncHandler(async (req, res) => {
    //1.validation
    if (!req.file) {
        return res.status(400).json({ message: "no file provided" })
    }
    //2. Get the pass of the image
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
    //3. upload to clouidnary
    const result = await cloudinaryUploadImage(imagePath);
    console.log(result);
    //4. Get the user from DB
    const user = await User.findById(req.user.id);
    //5. Delete the old profile photo if exist
    if (user.profilePhoto.publicId !== null) {
        await cloudinaryRemoveImage(user.profilePhoto.publicId);
    }
    //6. Change the profilePhoto field in the DB
    user.profilePhoto = {
        url: result.secure_url, //the url of the cloudinary will show in the console result
        publicId: result.public_id
    }
    await user.save();
    //7. Send res to client
    res.status(200).json({
        message: "your profile photo upload successfully",
        profilePhoto: { url: result.secure_url, public_id: result.public_id }
    });
    //8. Remove image from the server
    fs.unlinkSync(imagePath); // give here imagepath to delete it from server
});