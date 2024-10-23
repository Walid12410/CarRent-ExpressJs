const asyncHandler = require("express-async-handler");
const { validationCreateBooking } = require("../model/Booking");



/**
 * @desc Create new booking
 * @Route /api/booking/:id
 * @method POST
 * @access private (only user)
*/
module.exports.createBookignController = asyncHandler(async(req,res)=>{
    const { error } = validationCreateBooking(req.body);
    if(error){
        return res.status(400).json({message : error.details[0].message});
    }
});