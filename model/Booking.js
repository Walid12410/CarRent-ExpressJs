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
    promoCode : {
        type : String, minLength: 0 , required : false,
        maxLength: 100, trim: true
    },
    discountPercent: {
        type : Number , required: false,
        minLength: 0 , maxLength: 500,
        trim: true
    },
    mainCarPrice : {
        type : Number , required: true,
        trim : true
    },
    totalRentPrice : {
        type : Number , required: true,
        trim : true
    },
    startDate: {
        type: Date, required: true
    },
    endDate: {
        type: Date, required: true
    },
    isDelivered: {
        type : Boolean , default : false
    }
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
        mainCarPrice : Joi.number().min(1).max(500).required(),
        promoCode : Joi.string(),
        discountPercent : Joi.number()
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
        isDelivered : Joi.optional()
    });
    return schema.validate(obj);
}

module.exports = {
    Booking,
    validationCreateBooking,
    validationUpdateBooking
}