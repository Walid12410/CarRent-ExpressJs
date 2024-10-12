const Joi = require("joi");
const mongoose = require("mongoose");


// Review Schema
const ReviewSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required : true
    },
    carId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CarRent",
        required : true
    },
    rate : {
        type : Number,
        minLength : 1,
        maxLength : 5,
        default : 1
    },
    reviewText : {
        type: String, trim: true, 
        required : true 
    }
}, {
    timestamps : true,
    toJSON : {virtuals : true},
    toObject : {virtuals : true}
});

const Review = mongoose.model("Review", ReviewSchema);


// Validation Create Review
function validationCreateReview(obj){
    const Schema = Joi.object({
        rate : Joi.number().min(1).max(5).required(),
        reviewText : Joi.string().trim().required()
    });
    return Schema.validate(obj);
}

// Validation Update Review
function validationUpdateReview(obj){
    const Schema = Joi.object({
        rate : Joi.number().min(1).max(5),
        reviewText : Joi.string().trim()
    });
    return Schema.validate(obj);
}

module.exports = {
    Review,
    validationCreateReview,
    validationUpdateReview
};