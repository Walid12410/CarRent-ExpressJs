const mongoose = require("mongoose");
const Joi = require("joi");


// Car make schema
const CarMakeSchema = new mongoose.Schema({
    carMakeName : {
        type : String, required : true,
        minLength : 2 , maxLength : 20
    }
},{
    timestamps: true,
    toJSON : {virtuals : true},
    toObject : {virtuals : true}
});

// CarType Model
const CarMake = mongoose.model("CarMake" , CarMakeSchema);

// Validation Create Car Make
function validationCreateCarMake(obj){
    const schema = Joi.object({
        carMakeName : Joi.string().min(2).max(20).trim().required()
    });
    return schema.validate(obj);
}

// Validation Update Car Make
function validationUpdateCarMake(obj){
    const schema = Joi.object({
        carMakeName : Joi.string().min(2).max(20).trim()
    });
    return schema.validate(obj);
}


module.exports = {
    CarMake,
    validationCreateCarMake,
    validationUpdateCarMake
}


