const asyncHandler = require("express-async-handler");
const { Offer,
    validationCreateOffer,
    validationUpdateOffer
} = require("../model/Offer");
const mongoose = require("mongoose");
const { CarRent } = require("../model/CarRent");

/**
 * @desc Create new offer
 * @Route /api/offer/:id
 * @method POST
 * @access Private (only Employee User)
*/
module.exports.createOfferController = asyncHandler(async(req,res)=>{
    const {error} = validationCreateOffer(req.body);
    if(error){
        return res.status(400).json({ message : error.details[0].message});
    }

    let carFound = await CarRent.findById(req.params.id);
    if(!carFound){
        return res.status(404).json({message : "Car not found"});
    }

    const offerCreate = new Offer({
        carId : req.params.id,
        offerTitle : req.body.offerTitle,
        startDate : req.body.startDate,
        endDate : req.body.endDate,
        discountPrice : req.body.discountPrice
    });

    await offerCreate.save();

    res.status(201).json({ message : "New offer added successfully"});
});


/**
 * @desc get All Offer offer
 * @Route /api/offer
 * @method GET
 * @access public 
*/
// module.exports.getOfferController = asyncHandler(async(req,res)=>{
//     const offers = await Offer.find();
// });