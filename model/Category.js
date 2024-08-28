const mongoose = require("mongoose");
const Joi = require("joi");

// Category Schema
const CategorySchema = new mongoose.Schema({
    categoryName : {
        type : String,
        required : true,
        trim : true,
        minLength : 2,
        maxLength : 100
    }
},{timestamps : true});

// Category Model
const Category = mongoose.model("Category", CategorySchema);

// Validation Create Category
function validationCreateCategory(obj){
    const schema = Joi.object({
       categoryName : Joi.string().trim().min(2).max(100).required(), 
    });
    return schema.validate(obj);
}

// Validation Update Category
function validationUpdateCategory(obj){
    const schema = Joi.object({
        categoryName :  Joi.string().trim().min(2).max(100),
    });
    return schema.validate(obj);
}


module.exports = {
    Category,
    validationCreateCategory,
    validationUpdateCategory
}