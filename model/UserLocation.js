const Joi = require("joi");
const mongoose = require("mongoose");


const UserLocationSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', required: true
    },
    latitude: {
        type: Number, required: true
    },
    longitude: {
        type: Number, required: true
    },
    address: {
        type: String, required: false
    },
    city: {
        type: String, required: false
    },
    country: {
        type: String, required: false
    },
}, {
    timestamps: true,
});


// Create the user location model using schema
const UserLocation = mongoose.model('UserLocation', UserLocationSchema);

// validation create location
function validationCreateLocation(obj){
    const schema = Joi.object({
        userId : Joi.required(),
        latitude : Joi.number().required(),
        longitude : Joi.number().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        country: Joi.string().required()
    });
}

// validation update location
function validationUpdateLocation(obj){
    const schema = Joi.object({
        latitude : Joi.number(),
        longitude : Joi.number(),
        address: Joi.string(),
        city: Joi.string(),
        country: Joi.string(),
    });
}


module.exports = {
    UserLocation,
    validationCreateLocation,
    validationUpdateLocation
}