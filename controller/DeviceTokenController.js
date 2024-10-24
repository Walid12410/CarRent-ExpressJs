const asyncHandler = require("express-async-handler");
const { validationCreateDeviceToken, DeviceToken } = require("../model/DeviceToken");


/**
 * @desc Create new Category
 * @Route /api/deviceToken
 * @method POST
 * @access private (only user)
*/
module.exports.deviceTokenController = asyncHandler(async(req,res)=>{
    const { error } = validationCreateDeviceToken(req.body); 
    if(error){
        return res.status(400).json({message : error.details[0].message});
    }

    const { deviceToken , playerId} = req.body;
    const userId = req.user.id;

    const existingTokens = await DeviceToken.find({ userId });
    const existingToken = existingTokens.find(token => token.playerId === playerId);

    if(existingToken){
        existingToken.deviceToken = deviceToken;
        await existingToken.save();
        return res.status(200).json({message : "Device token updated."});
    }else{
        const newDeviceToken = new DeviceToken({
            deviceToken,
            playerId,
            userId
        });
        await newDeviceToken.save();
        return res.status(201).json({message : "New device token created."});
    }
});