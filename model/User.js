const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

// User Schema
const UserSchema = new mongoose.Schema({
    firstName: {
        type: String, required: true,
        trim: true, minLength: 2,
        maxLength: 100
    },
    lastName: {
        type: String, required: true,
        trim: true, minLength: 2,
        maxLength: 100
    },
    email: {
        type: String, required: true,
        unique: true, minLength: 5,
        maxLength: 100,trim: true
    },
    profilePhoto: {
        type: Object,
        default: {
            url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
            publicId: null,
        }
    },
    phoneNumber: {
        type: String, required: true,
        trim: true, minLength: 6,
        maxLength: 20
    },
    password: {
        type: String, required: true,
        minLength: 8, maxLength: 100,
    },
    isAdmin: {
        type: Boolean, default: false
    },
}, {
    timestamps: true
});


// Generate Auth Token
UserSchema.methods.generateAuthToken = function () {
    return jwt.sign({ id: this._id, isAdmin: this.isAdmin }, process.env.JWT_SECRET);
}

// User Model
const User = mongoose.model("User", UserSchema);


// Validation Register User
function validationRegisterUser(obj) {
    const schema = Joi.object({
        firstName: Joi.string().min(2).max(100).trim().required(),
        lastName: Joi.string().min(2).max(100).trim().required(),
        email: Joi.string().min(5).max(100).trim().required(),
        phoneNumber: Joi.string().min(6).max(20).trim().required(),
        password: Joi.string().min(8).max(100).trim().required()
    });
    return schema.validate(obj);
}

// Validation Login User
function validationLoginUser(obj) {
    const schema = Joi.object({
        email: Joi.string().min(5).trim().required().email(),
        password: Joi.string().min(8).trim().required()
    });
    return schema.validate(obj);
}

// Validation Update User
function validationUpdateUser(obj) {
    const schema = Joi.object({
        firstName: Joi.string().min(2).max(100).trim(),
        lastName: Joi.string().min(2).max(100).trim(),
        phoneNumber: Joi.string().min(6).max(20).trim(),
        password: Joi.string().min(8).max(100).trim()
    });
    return schema.validate(obj);
}



module.exports = {
    User,
    validationRegisterUser,
    validationLoginUser,
    validationUpdateUser
}