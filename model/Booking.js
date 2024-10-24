const mongoose = require("mongoose");
const Joi = require("joi");


const BookingSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId, required: true,
        ref: "User"
    },
    carId : {
        type: mongoose.Schema.Types.ObjectId, required : true,
        ref : "CarRent"
    },
    daysRent : {
        type : Number , required: true,
        minLength: 1 , maxLength: 100,
        trim: true
    },
    totalRentPrice : {
        type : String , required: true,
        trim : true
    },
    startDate: {
        type: Date, required: true
    },
    endDate: {
        type: Date, required: true
    },
},{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


BookingSchema.virtual("car",{
    ref : "CarRent",
    localField : "carId",
    foreignField : "_id"
});

BookingSchema.virtual("user",{
    ref : "User",
    localField : "userId",
    foreignField : "_id"
});

const Booking = mongoose.model('Booking',BookingSchema);


// Validation Create booing
function validationCreateBooking(obj) {
    const schema = Joi.object({
        daysRent: Joi.number().min(1).max(100).required(),
        totalRentPrice: Joi.string().required(),
        startDate: Joi.date().iso().required(),
        endDate: Joi.date().iso().greater(Joi.ref('startDate')).required(),
    });
    return schema.validate(obj);
}


// Validation Update booking
function validationUpdateBooking(obj) {
    const schema = Joi.object({
        daysRent: Joi.number().min(1).max(100),
        totalRentPrice: Joi.string(),
        startDate: Joi.date().iso(),
        endDate: Joi.date().iso().greater(Joi.ref('startDate')),
    });
    return schema.validate(obj);
}

module.exports = {
    Booking,
    validationCreateBooking,
    validationUpdateBooking
}