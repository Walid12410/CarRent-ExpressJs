const Joi = require("joi");
const mongoose = require("mongoose");


const CompanyLocationSchema = new Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Companies', required: true
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


// Create the company location model using schema
const CompanyLocation = mongoose.model('CompanyLocation', CompanyLocationSchema);

// validation create location
function validationCreateCompayLocation(obj){
    const schema = Joi.object({
        latitude : Joi.number().required(),
        longitude : Joi.number().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        country: Joi.string().required()
    });
    return schema.validate(obj);
}

// validation update location
function validationUpdateCompanyLocation(obj){
    const schema = Joi.object({
        latitude : Joi.number(),
        longitude : Joi.number(),
        address: Joi.string(),
        city: Joi.string(),
        country: Joi.string(),
    });
    return schema.validate(obj);
}


module.exports = {
    CompanyLocation,
    validationCreateCompayLocation,
    validationUpdateCompanyLocation
}