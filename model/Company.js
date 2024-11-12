const mongoose = require("mongoose");
const Joi = require("joi");

// Companies Schema
const CompaniesSchema = new mongoose.Schema({
    companyName: {
        type: String, required: true,
        trim: true, minLength: 2,
        maxLength: 100
    },
    companyEmail: {
        type: String, required: true,
        trim: true, minLength: 5,
        maxLength: 100,
    },
    companyPhoneNumber: {
        type: String, required: true,
        trim: true, minLength: 6,
        maxLength: 20
    },
    latitude: {
        type: Number, required: true
    },
    longitude: {
        type: Number, required: true
    },
    address: {
        type: String, required: true,
        minLength: 2, maxLength: 200
    },
    city: {
        type: String, required: true,
        minLength: 2, maxLength: 200
    },
    country: {
        type: String, required: true,
        minLength: 2, maxLength: 200
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

CompaniesSchema.virtual("imageCompany", {
    ref: "CompanyImage",
    foreignField: "companyID",
    localField: "_id"
});

// Companies Modal
const Companies = mongoose.model("Companies", CompaniesSchema);

// Validation Compaines Create
function validationCompainesCreate(obj) {
    const schema = Joi.object({
        companyName: Joi.string().trim().min(2).max(100).required(),
        companyEmail: Joi.string().trim().min(5).max(100).required(),
        companyPhoneNumber: Joi.string().min(6).max(20).trim().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        address: Joi.string().min(2).max(200).required(),
        city: Joi.string().min(2).max(200).required(),
        country: Joi.string().min(2).max(200).required(),
    });
    return schema.validate(obj);
}

// Validation Update Comapnies
function validationComapainesUpdate(obj) {
    const schema = Joi.object({
        companyName: Joi.string().trim().min(2).max(100),
        companyEmail: Joi.string().trim().min(5).max(100).email(),
        companyPhoneNumber: Joi.string().min(6).max(20).trim(),
        latitude: Joi.number(),
        longitude: Joi.number(),
        address: Joi.string().min(2).max(200),
        city: Joi.string().min(2).max(200),
        country: Joi.string().min(2).max(200),
    });
    return schema.validate(obj);
}


module.exports = {
    Companies,
    validationCompainesCreate,
    validationComapainesUpdate
}