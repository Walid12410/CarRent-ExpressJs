const mongoose = require("mongoose");


const BookingSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId, required: true,
        ref: "User"
    },
    carId : {
        type: mongoose.Schema.Types.ObjectId, required : true,
        ref : "Companies"
    },
    daysRent : {
        tpye : Number , required: true,
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


const Booking = mongoose.model('Booking',BookingSchema);


// Validation Create booing
function validationCreateBooking(obj) {
    const schema = Joi.object({
        carId: Joi.required(),
        companyId: Joi.required(),
        daysRent: Joi.number().min(1).max(100).required(),
        totalRentPrice: Joi.date().iso().required(),
        startDate: Joi.date().iso().required(),
        endDate: Joi.date().iso().greater(Joi.ref('startDate')).required(),
    });
    return schema.validate(obj);
}


// Validation Update booking
function validationUpdateBooking(obj) {
    const schema = Joi.object({
        daysRent: Joi.number().min(1).max(100),
        totalRentPrice: Joi.date().iso(),
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