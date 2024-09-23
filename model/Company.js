const mongoose = require("mongoose");
const Joi = require("joi");

// Companies Schema
const CompaniesSchema = new mongoose.Schema({
    companyName:{
        type: String,required : true,
        trim : true, minLength: 2,
        maxLength : 100
    },
    companyEmail: {
        type: String, required: true,
        trim: true, minLength : 5,
        maxLength: 100,
    },
    companyPhoneNumber: {
        type: String,  required : true,
        trim: true,  minLength :6 ,
        maxLength : 20
    },
    companyAddress : {
        type: String, required: true,
        trim: true, minLength : 2,
        maxLength: 100,
    },
    companyCity: {
        type: String, required: true,
        trim: true, minLength : 2,
        maxLength: 100,
    },
    companyState: {
        type: String, required: true,
        trim: true, minLength : 2,
        maxLength: 100,
    },
},{
    timestamps: true,
    toJSON : {virtuals : true},
    toObject : {virtuals : true}
});

CompaniesSchema.virtual("imageCompany",{
    ref: "CompanyImage",
    foreignField : "companyID",
    localField : "_id"
});

// Companies Modal
const Companies = mongoose.model("Companies",CompaniesSchema);

// Validation Compaines Create
function validationCompainesCreate(obj){
    const schema = Joi.object({
        companyName : Joi.string().trim().min(2).max(100).required(),
        companyEmail :  Joi.string().trim().min(5).max(100).required(),
        companyPhoneNumber: Joi.string().min(6).max(20).trim().required(),
        companyAddress : Joi.string().trim().min(2).max(100).required(),
        companyCity: Joi.string().trim().min(2).max(100).required(),
        companyState: Joi.string().trim().min(2).max(100).required(),
    });
    return schema.validate(obj);
}

// Validation Update Comapnies
function validationComapainesUpdate(obj){
    const schema = Joi.object({
        companyName : Joi.string().trim().min(2).max(100),
        companyEmail :  Joi.string().trim().min(5).max(100).email(),
        companyPhoneNumber: Joi.string().min(6).max(20).trim(),
        companyAddress : Joi.string().trim().min(2).max(100),
        companyCity: Joi.string().trim().min(2).max(100),
        companyState: Joi.string().trim().min(2).max(100),
    });
    return schema.validate(obj);
}


module.exports = {
    Companies,
    validationCompainesCreate,
    validationComapainesUpdate
}