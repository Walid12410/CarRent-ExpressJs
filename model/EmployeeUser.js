const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

// Employee User Schema
const EmployeeUserSchema = new mongoose.Schema({
    companyID :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Companies",
        required : true
    },
    userName: {
        type: String, required: true,
        trim: true, minLength: 2,
        maxLength: 100
    },
    email: {
        type: String, required: true,
        unique: true, minLength: 5,
        maxLength: 100, trim: true
    },
    password: {
        type: String, required: true,
        minLength: 8, maxLength: 100,
    },
}, {
    timestamps: true,
    toJSON : {virtuals : true},
    toObject : {virtuals : true}
});


// Generate Auth Token
EmployeeUserSchema.methods.generateEmployeeAuthToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_EMPLOYEE, { expiresIn: '1h' });
}

EmployeeUserSchema.virtual("companyDetails", {
    ref: "Companies",
    foreignField : "_id",
    localField : "companyID"
});

// User Model
const EmployeeUser = mongoose.model("EmployeeUser", EmployeeUserSchema);


// Validation Register User
function validationRegisterEmployeeUser(obj) {
    const schema = Joi.object({
        companyID: Joi.required(),
        userName: Joi.string().min(2).max(100).trim().required(),
        email: Joi.string().min(5).max(100).trim().required(),
        password: Joi.string().min(8).max(100).trim().required()
    });
    return schema.validate(obj);
}

// Validation Login User
function validationLoginEmployeeUser(obj) {
    const schema = Joi.object({
        email: Joi.string().min(5).trim().required().email(),
        password: Joi.string().min(8).trim().required()
    });
    return schema.validate(obj);
}


module.exports = {
    EmployeeUser,
    validationRegisterEmployeeUser,
    validationLoginEmployeeUser,
}