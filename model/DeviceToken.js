const mongoose = require("mongoose");


const DeviceTokenSchema = new mongoose.Schema({
    deviceToken : {
        type: String , trim: true,
        required : true
    },
    playerId : {
        type: String , trim: true,
        required : true
    },
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" , required :true
    }
});


const DeviceToken = mongoose.model('DeviceToken', DeviceTokenSchema);


function validationCreateDeviceToken(obj) {
    const schema = Joi.object({
        deviceToken: Joi.string().required(),
        playerId: Joi.string().required(),
    });
    return schema.validate(obj);
}


module.exports = {
    DeviceToken,
    validationCreateDeviceToken
}