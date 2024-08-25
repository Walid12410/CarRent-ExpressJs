const mongoose = require("mongoose");
const Joi = require("joi");

// Companies Schema
const CompaniesSchema = new mongoose.Schema({
    companyName:{
        type: String,
        required : true,
        trim : true,
        minLength: 2,
        maxLength : 100
    },
    companyEmail: {
        type: String,
        required: true,
        trim: true,
        minLength : 5,
        maxLength: 100,
    },
    CompanyPhoneNumber: {
        type: String,
        required : true,
        trim: true,
        minLength :6 ,
        maxLength : 20
    },
    CompanyAddress : {
        type: String,
        required: true,
        trim: true,
        minLength : 2,
        maxLength: 100,
    },
    CompanyCity: {
        type: String,
        required: true,
        trim: true,
        minLength : 2,
        maxLength: 100,
    },
    CompanyState: {
        type: String,
        required: true,
        trim: true,
        minLength : 2,
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
        CompanyPhoneNumber: Joi.string().min(6).max(20).trim().required(),
        CompanyAddress : Joi.string().trim().min(2).max(100).required(),
        CompanyCity: Joi.string().trim().min(2).max(100).required(),
        CompanyState: Joi.string().trim().min(2).max(100).required(),
    });
    return schema.validate(obj);
}

// Validation Update Comapnies
function validationComapainesUpdate(obj){
    const schema = Joi.object({
        companyName : Joi.string().trim().min(2).max(100),
        companyEmail :  Joi.string().trim().min(5).max(100).email(),
        CompanyPhoneNumber: Joi.string().min(6).max(20).trim(),
        CompanyAddress : Joi.string().trim().min(2).max(100),
        CompanyCity: Joi.string().trim().min(2).max(100),
        CompanyState: Joi.string().trim().min(2).max(100),
    });
    return schema.validate(obj);
}


module.exports = {
    Companies,
    validationCompainesCreate,
    validationComapainesUpdate
}