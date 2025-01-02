const mongoose = require("mongoose");
const Joi = require("joi");


const OfferSchema = new mongoose.Schema({
    carId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CarRent", required: true
    },
    offerTitle: {
        type: String, trim: true,
        required: true, minLength: 2,
        maxLength: 50
    },
    startDate: {
        type: Date, required: true,
    },
    endDate: {
        type: Date, required: true
    },
    discountPrice : {
        type : String, required : true,
        trim : true , minLength : 1,
        maxLength : 20
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

OfferSchema.virtual("car",{
    ref : "CarRent",
    localField : "carId",
    foreignField : "_id"
});


// Create the Offer model using the schema
const Offer = mongoose.model('Offer', OfferSchema);

// Validation Create Offer
function validationCreateOffer(obj) {
    const schema = Joi.object({
        startDate: Joi.date().iso().required(),
        endDate: Joi.date().iso().greater(Joi.ref('startDate')).required(),
        offerTitle: Joi.string().trim().min(2).max(50).required(),
        discountPrice : Joi.string().trim().min(1).max(20).required()
    });
    return schema.validate(obj);
}

// Validation Update Offer
function validationUpdateOffer(obj) {
    const schema = Joi.object({
        carId : Joi.optional(),
        startDate: Joi.date().iso(),
        endDate: Joi.date().iso().greater(Joi.ref('startDate')),
        offerTitle: Joi.string().trim().min(2).max(50),
        discountPrice : Joi.string().trim().min(1).max(20)
    });
    return schema.validate(obj);
}

module.exports = {
    Offer,
    validationCreateOffer,
    validationUpdateOffer
}