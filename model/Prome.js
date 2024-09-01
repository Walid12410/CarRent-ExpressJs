const mongoose = require("mongoose");
const Joi = require("joi");


// Define the Discounts and Promotions Schema
const promoSchema = new mongoose.Schema({
    promoCode: {
        type: String, unique: true,
        required: true, minLength: 2,
        maxLength: 10
    },
    discountAmount: {
        type: Number, default: 0
    },
    discountPercentage: {
        type: Number, default: 0
    },
    startDate: {
        type: Date, required: true
    },
    endDate: {
        type: Date, required: true
    },
    usageLimit: {
        type: Number, default: 1
    },
    usedCount: {
        type: Number, default: 0
    },
    status: {
        type: String, enum: ['Active', 'Expired', 'Inactive'],
        default: 'Active'
    },
    companyID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Companies",
        required: true
    },
    promoTitle : {
        type: String,
        required : true,
        minLength : 2,
        maxLength : 100,
        trim: true
    },
    promoDescription : {
        type: String, required : true,
        minLength : 2 ,
        trim : true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


promoSchema.virtual("comapanyDetails", {
    ref: "Companies",
    foreignField: "_id",
    localField: "companyID"
});


// Create the Promo model using the schema
const Promo = mongoose.model('Promo', promoSchema);


// Validation Create Promo
function validationCreatePromo(obj) {
    const schema = Joi.object({
        promoCode: Joi.string().min(2).max(100).trim().required(),
        discountAmount: Joi.number().min(0),
        discountPercentage: Joi.number().min(0).max(100),
        startDate: Joi.date().iso().required(),
        endDate: Joi.date().iso().greater(Joi.ref('startDate')).required(),
        usageLimit: Joi.number().integer().min(1),
        usedCount: Joi.number().integer().min(0),
        companyID: Joi.string().required(),
        promoTitle : Joi.string().trim().min(2).max(100).required(),
        promoDescription : Joi.string().trim().min(2).required()
    });
    return schema.validate(obj);
}


// Validation Update Promo
function validationUpdatePromo(obj) {
    const schema = Joi.object({
        promoCode: Joi.string().min(2).max(100).trim(),
        discountAmount: Joi.number().min(0),
        discountPercentage: Joi.number().min(0).max(100),
        startDate: Joi.date().iso(),
        endDate: Joi.date().iso().greater(Joi.ref('startDate')),
        usageLimit: Joi.number().integer().min(1),
        usedCount: Joi.number().integer().min(0),
        status: Joi.string().valid('Active', 'Expired', 'Inactive'),
        promoTitle : Joi.string().trim().min(2).max(100),
        promoDescription : Joi.string().trim().min(2)
    });
    return schema.validate(obj);
}


module.exports = {
    Promo,
    validationCreatePromo,
    validationUpdatePromo
};
