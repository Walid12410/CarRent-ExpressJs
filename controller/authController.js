const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { User, validationRegisterUser, validationLoginUser } = require("../model/User");


/**
 * @desc Register New User - SignUp
 * @Route /api/auth/register
 * @method POST
 * @access Public
*/
module.exports.registerUserController = asyncHandler(async (req, res) => {
    const { error } = validationRegisterUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    // check email exists
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: hashedPassword,
        latitude: null,
        longitude : null
    });

    // save user to database
    await user.save();

    // send a success message 
    res.status(201).json({ message: "you registered successfully, please login" });
});

/**
 * @desc Login User
 * @Route /api/auth/login
 * @method POST
 * @access Public
 */
module.exports.loginUserController = asyncHandler(async (req, res) => {
    const {error} = validationLoginUser(req.body);
    if(error){
        return res.status(400).json({message : error.details[0].message});
    }

    // Check Email if found
    let user = await User.findOne({email : req.body.email });
    if(!user){
        return res.status(400).json({message : "Incorrect Email Or Password"});
    }

    // Check password with hashedPassword
    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
    if(!isPasswordMatch){
        return res.status(400).json({message : "Incorrect Email Or Password"});
    }

   // @TODO Email Verification

   const token = user.generateAuthToken();
   
   res.status(200).json({
    _id: user._id,
    firstName : user.firstName,
    lastName : user.lastName,
    profilePhoto : user.profilePhoto,
    isAdmin : user.isAdmin,
    token
   });
});