const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { EmployeeUser,
    validationLoginEmployeeUser,
    validationRegisterEmployeeUser
} = require("../model/EmployeeUser");
const { Companies } = require("../model/Company");
const mongoose = require("mongoose");


/**
 * @desc Register New Employee User - SignUp
 * @Route /api/auth-employee/register
 * @method POST
 * @access private(only Admin)
*/
module.exports.registerEmployeeUserController = asyncHandler(async(req,res)=>{
    const {error} = validationRegisterEmployeeUser(req.body);
    if(error) {
        return res.status(400).json({message : error.details[0].message });
    }

    if (!req.body.companyID || !mongoose.Types.ObjectId.isValid(req.body.companyID)) {
        return res.status(400).json({ message: "Invalid company ID" });
    }

    // Check email exists
    let employeeUser = await EmployeeUser.findOne({email : req.body.email});
    if(employeeUser) { 
        return res.status(400).json({message : "User already exists"});
    }

    let company = await Companies.findOne({ _id : req.body.companyID});
    if(!company){
        return res.status(400).json({message : "Company not found"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt);

    employeeUser = new EmployeeUser({
        companyID : req.body.companyID,
        userName: req.body.userName,
        email : req.body.email,
        password : hashedPassword
    });

    await employeeUser.save();

    res.status(201).json({message : "Employee account created successfully"});
});

/**
 * @desc Login Employee User
 * @Route /api/auth-employee/login
 * @method POST
 * @access public
*/
module.exports.loginEmployeeUserController = asyncHandler(async(req,res)=>{
    const {error} = validationLoginEmployeeUser(req.body);
    if(error) {
        return res.status(400).json({message : error.details[0].message});
    }

    const employeeUser = await EmployeeUser.findOne({email : req.body.email});
    if(!employeeUser){
        return res.status(400).json({message : "Incorrect Email Or Password"});
    }

    const isPasswordMatch = await bcrypt.compare(req.body.password, employeeUser.password);
    if(!isPasswordMatch){
        return res.status(400).json({message : "Incorrect Email Or Password"})
    }

    const token = employeeUser.generateEmployeeAuthToken();

    res.status(200).json({
        _id : employeeUser._id,
        userName : employeeUser.userName,
        comapnyID : employeeUser.companyID,
        token
    });
});