const asyncHandler = require("express-async-handler");
const { Promo,
    validationCreatePromo,
    validationUpdatePromo
} = require("../model/Prome");
const { cloudinaryRemoveImage , cloudinaryUploadImage } = require("../utils/cloudinary");
const path = require("path");
const fs = require("fs");

/**
 * @desc Create new Promo
 * @Route /api/promo
 * @method POST
 * @access private (only admin)
*/
module.exports.createNewPromoController = asyncHandler(async (req, res) => {
    const { error } = validationCreatePromo(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
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
        promoTitle: req.body.promoTitle,
        promoDescription: req.body.promoDescription
    });

    await promoCheck.save();

    res.status(201).json({ message: "New promo code added successfully" });
});


/**
 * @desc Get All Promo
 * @Route /api/promo
 * @method GET
 * @access public
*/
module.exports.getAllPromoCodeController = asyncHandler(async (req, res) => {
    const PROMO_PER_PAGE = 3;
    const { pageNumber } = req.query;
    let promo;

    if (pageNumber) {
        promo = await Promo.find().skip((pageNumber - 1) * PROMO_PER_PAGE)
            .limit(PROMO_PER_PAGE)
            .sort({ createdAt: -1 })
    } else {
        promo = await Promo.find();
    }

    res.status(200).json(promo);
});


/**
 * @desc Get One Promo
 * @Route /api/promo/:id
 * @method GET
 * @access public
*/
module.exports.getOnePromoCodeController = asyncHandler(async (req, res) => {
    const promo = await Promo.findById(req.params.id);
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
            promoTitle: req.body.promoTitle,
            promoDescription: req.body.promoDescription
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


/**
 * @desc upload promo image 
 * @Route /api/promo/upload-image/:id
 * @method POST
 * @access private (only employee user)
*/
module.exports.uploadPromoImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file provided" });
    }

    const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
    const result = await cloudinaryUploadImage(imagePath);
    const promo = await Promo.findById(req.params.id);

    if (promo.promoImage && promo.promoImage.cloudinary_id) {
        await cloudinaryRemoveImage(promo.promoImage.cloudinary_id);
    }

    promo.promoImage = {
        url: result.secure_url, 
        cloudinary_id: result.public_id
    };
    await promo.save();

    res.status(200).json({
        message: "Promo image uploaded successfully",
        promoImage: { url: result.secure_url, cloudinary_id: result.public_id }
    });

    fs.unlinkSync(imagePath);
});