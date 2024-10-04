const mongoose = require("mongoose");
const Joi = require("joi");

// Feature Schema
const FeatureSchema = new mongoose.Schema({
    carId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CarRent",
        required : true
    },
    startDate : {
        type : Date , required : true
    },
    endDate : {
        type : Date , required: true
    },
},{timestamps : true,
    toJSON : {virtuals : true},
    toObject : {virtuals : true}
});


FeatureSchema.virtual("car",{
    ref : "CarRent",
    localField : "carId",
    foreignField : "_id"
});

// Create feature model using the schema
const Feature = mongoose.model('Feature',FeatureSchema);


// Validation Create Feature
function validationCreateFeature(obj){
    const schema = Joi.object({
        startDate: Joi.date().iso().required(),
        endDate: Joi.date().iso().greater(Joi.ref('startDate')).required(),
    });
    return schema.validate(obj);
}

// Validation update Feature
function validationUpdateFeature(obj){
    const schema = Joi.object({
        startDate: Joi.date().iso(),
        endDate: Joi.date().iso().greater(Joi.ref('startDate')),
    });
    return schema.validate(obj);
}

module.exports = {
    Feature,
    validationCreateFeature,
    validationUpdateFeature
}
