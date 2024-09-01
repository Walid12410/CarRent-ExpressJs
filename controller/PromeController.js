const asyncHandler = require("express-async-handler");
const { Promo,
    validationCreatePromo,
    validationUpdatePromo
} = require("../model/Prome");
const { Companies } = require("../model/Company");
const mongoose = require("mongoose");

/**
 * @desc Create new Promo
 * @Route /api/promo
 * @method POST
 * @access Private (only Employee User)
*/
module.exports.createNewPromoController = asyncHandler(async (req, res) => {
    const { error } = validationCreatePromo(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    if (!req.body.companyID || !mongoose.Types.ObjectId.isValid(req.body.companyID)) {
        return res.status(400).json({ message: "Invalid Object ID" });
    }

    let companyFound = await Companies.findOne({ _id: req.body.companyID });
    if (!companyFound) {
        return res.status(400).json({ message: "Company not found" });
    }


    let promoCheck = await Promo.findOne({ promoCode: req.body.promoCode });
    if (promoCheck) {
        return res.status(400).json({
            message: `This Promo Already Created before : 
            ${req.body.promoCode} `
        });
    }

    promoCheck = new Promo({
        promoCode: req.body.promoCode,
        discountAmount: req.body.discountAmount,
        discountPercentage: req.body.discountPercentage,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        usageLimit: req.body.usageLimit,
        usedCount: req.body.usedCount,
        companyID: req.body.companyID,
        promoTitle : req.body.promoTitle,
        promoDescription : req.body.promoDescription
    });

    promoCheck.save();

    res.status(201).json({ message: "New promo code added successfully" });
});


/**
 * @desc Get All Promo
 * @Route /api/promo
 * @method Get
 * @access public
*/
module.exports.getAllPromoCodeController = asyncHandler(async (req, res) => {
    const promo = await Promo.find().populate({
        path: "comapanyDetails",
        populate: { path: "imageCompany", match: { isDefaultImage: true } }
    });
    res.status(200).json(promo);
});


/**
 * @desc Get One Promo
 * @Route /api/promo/:id
 * @method Get
 * @access public
*/
module.exports.getOnePromoCodeController = asyncHandler(async (req, res) => {
    const promo = await Promo.findById(req.params.id).populate({
        path: "comapanyDetails",
        populate: { path: "imageCompany", match: { isDefaultImage: true } }
    });
    if (promo) {
        res.status(200).json(promo);
    } else {
        res.status(404).json({ message: "Promo not found" });
    }
});


/**
 * @desc Get One Promo
 * @Route /api/promo/:id
 * @method PUT
 * @access private (only employee user)
*/
module.exports.updatePromoCodeController = asyncHandler(async (req, res) => {
    const { error } = validationUpdatePromo(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    const updatePromo = await Promo.findByIdAndUpdate(req.params.id, {
        $set: {
            promoCode: req.body.promoCode,
            discountAmount: req.body.discountAmount,
            discountPercentage: req.body.discountPercentage,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            usageLimit: req.body.usageLimit,
            usedCount: req.body.usedCount,
            promoTitle : req.body.promoTitle,
            promoDescription : req.body.promoDescription
        }
    }, { new: true });

    if (!updatePromo) {
        return res.status(404).json({ message: "Promo not found" });
    }

    res.status(200).json(updatePromo);
});


/**
 * @desc Delete one Promo
 * @Route /api/promo/:id
 * @method DELETE
 * @access private (only employee user)
*/
module.exports.deleteOnePromoController = asyncHandler(async (req, res) => {
    const promoCheck = await Promo.findById(req.params.id);
    if (!promoCheck) {
        res.status(404).json({ message: "Promo not found" });
    } else {
        await Promo.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Promo has been succefully deleted" });
    }
});