const mongoose = require("mongoose");
const Joi = require("joi");


// notification schema
const NotificationSchema = new mongoose.Schema({
    title : {
        type: String, 
        required: true,
    },
    body : {
        type: String,
        required: true
    },
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},{
    timestamps: true
});

const Notification = mongoose.model("Notification",NotificationSchema);

// Validation create Notification
function validationCreateNotification(obj){
    const schema = Joi.object({
        title : Joi.string().required(),
        body : Joi.string().required(),
    });
    return schema.validate(obj);
}

module.exports = {
    Notification,
    validationCreateNotification
}