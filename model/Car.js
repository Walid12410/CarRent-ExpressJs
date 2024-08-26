const mongoose = require("mongoose");
const Joi = require("joi");

// Car Schema
const CarSchema = new mongoose.Schema({
    carMake: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 100
    },
    carModel: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 100
    },
    year: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 100
    },
    carType: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 100
    },
    status: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 100
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Companies",
        required: true
    },
    licensePlate: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        maxLength: 100
    },
    vin: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 100
    },
    mileage: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 100
    },
    fuelType: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 100
    },
    Transmission: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 100
    }
}, { timestamps: true });

const Car = mongoose.model("Car",CarSchema);

module.exports = {
    Car
};