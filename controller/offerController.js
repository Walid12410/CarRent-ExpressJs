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
 * @access private (only Employee User)
*/
module.exports.createOfferController = asyncHandler(async (req, res) => {
    const { error } = validationCreateOffer(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    let carFound = await CarRent.findById(req.params.id);
    if (!carFound) {
        return res.status(404).json({ message: "Car not found" });
    }

    const offerCreate = new Offer({
        carId: req.params.id,
        offerTitle: req.body.offerTitle,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        discountPrice: req.body.discountPrice
    });

    await offerCreate.save();

    res.status(201).json({ message: "New offer added successfully" });
});


/**
 * @desc get All offer
 * @Route /api/offer
 * @method GET
 * @access public 
*/
module.exports.getAllOfferController = asyncHandler(async (req, res) => {
    const offers = await Offer.find();
    res.status(200).json(offers);
});


/**
 * @desc get One offer
 * @Route /api/offer/:id
 * @method GET
 * @access public 
*/
module.exports.getOneOfferController = asyncHandler(async (req, res) => {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
        res.status(404).json({ message: "Offer not found" });
    } else {
        res.status(200).json(offer);
    }
});


/**
 * @desc Update Offer 
 * @Route /api/offer/:id
 * @method PUT
 * @access private (only Employee User)
*/
module.exports.updateOfferController = asyncHandler(async (req, res) => {
    const { error } = validationUpdateOffer(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    if (req.body.carId) {
        if (!mongoose.Types.ObjectId.isValid(req.body.carId)) {
            return res.status(400).json({ message: "Invalid Car ID" });
        }
        let carFound = await CarRent.findById(req.body.carId);
        if (!carFound) {
            return res.status(404).json({ message: "Car not found" });
        }
    }

    const updateOffer = await Offer.findByIdAndUpdate(req.params.id, {
        $set: {
            carId: req.body.carId,
            offerTitle: req.body.offerTitle,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            discountPrice: req.body.discountPrice
        }
    }, { new: true });

    if (!updateOffer) {
        return res.status(404).json({ message: "Offer not found" });
    }

    res.status(200).json(updateOffer);
});


/**
 * @desc Update Offer 
 * @Route /api/offer/:id
 * @method DELETE
 * @access private (only Employee User)
*/
module.exports.deleteOfferController = asyncHandler(async(req,res)=>{
    const offerFound = await Offer.findById(req.params.id);
    if(!offerFound){
        res.status(404).json({message : "Offer not found"});
    }else{
        await Offer.findByIdAndDelete(req.params.id);
        res.status(200).json("Offer deleted successfully");
    }
});