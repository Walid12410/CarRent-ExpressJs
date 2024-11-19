const mongoose = require("mongoose");
const Joi = require("joi");

// Car Schema
const CarRentSchema = new mongoose.Schema({
    carMakeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CarMake",
        required: true
    },
    carModel: {
        type: String, required: true,
        trim: true, minLength: 2,
        maxLength: 100
    },
    year: {
        type: String, required: true,
    },
    color: {
        type: String, required: true,
        trim: true, minLength: 2,
        maxLength: 100
    },
    carStatus: {
        type: String, required: true,
        trim: true, minLength: 2,
        maxLength: 100
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Companies",
        required: true
    },
    licensePlate: {
        type: String, required: true,
        trim: true, minLength: 1,
        maxLength: 100
    },
    mileage: {
        type: String, required: true,
        trim: true, minLength: 2,
        maxLength: 100
    },
    fuelType: {
        type: String, required: true, trim: true,
        minLength: 2, maxLength: 100
    },
    transmission: {
        type: String, required: true,
        trim: true, minLength: 2,
        maxLength: 100
    },
    rentPrice: {
        type: String, required: true,
        trim: true, minLength: 1,
        maxLength: 20
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


CarRentSchema.virtual("category", {
    ref: "Category",
    localField: "categoryId",
    foreignField: "_id"       
});


CarRentSchema.virtual("companyDetails",{
    ref: "Companies",
    foreignField : "_id",
    localField : "companyId"
});

CarRentSchema.virtual("CarImage", {
    ref: "CarImage",
    foreignField : "carRentID",
    localField : "_id"
});

const CarRent = mongoose.model("CarRent", CarRentSchema);

// Validation for creating car rent
function validationCreateCarRent(obj) {
    const schema = Joi.object({
        carMakeId: Joi.required(),
        carModel: Joi.string().trim().min(2).max(100).required(),
        year: Joi.string().trim().required(),
        color: Joi.string().trim().min(2).max(100).required(),
        carStatus: Joi.string().trim().min(2).max(100).required(),
        licensePlate: Joi.string().trim().min(1).max(100).required(),
        mileage: Joi.string().trim().min(2).max(100).required(),
        fuelType: Joi.string().trim().min(2).max(100).required(),
        transmission: Joi.string().trim().min(2).max(100).required(),
        rentPrice: Joi.string().trim().min(1).max(20).required(),
        categoryId: Joi.required(),
    });
    return schema.validate(obj);
}

// Validation for update car rent
function validationUpdateCarRent(obj) {
    const schema = Joi.object({
        carMakeId: Joi.optional(),
        carModel: Joi.string().trim().min(2).max(100),
        year: Joi.string().trim(),
        color: Joi.string().trim().min(2).max(100),
        carStatus: Joi.string().trim().min(2).max(100),
        licensePlate: Joi.string().trim().min(1).max(100),
        mileage: Joi.string().trim().min(2).max(100),
        fuelType: Joi.string().trim().min(2).max(100),
        transmission: Joi.string().trim().min(2).max(100),
        rentPrice: Joi.string().trim().min(1).max(20),
        categoryId: Joi.string().hex()
    });
    return schema.validate(obj);
}

module.exports = {
    CarRent,
    validationCreateCarRent,
    validationUpdateCarRent
};