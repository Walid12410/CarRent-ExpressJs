const asyncHandler = require("express-async-handler");
const { Promo,
    validationCreatePromo,
    validationUpdatePromo
} = require("../model/Prome");
const { cloudinaryRemoveImage, cloudinaryUploadImage } = require("../utils/cloudinary");
const path = require("path");
const fs = require("fs");
const moment = require("moment");
const mongoose = require("mongoose");


/**
 * @desc Create new Promo
 * @Route /api/promo
 * @method POST
 * @access private (only employee)
*/
module.exports.createNewPromoController = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No image provided" });
    }

    const imagePath = path.join(__dirname, `../images/${req.file.filename}`);

    try {
        const { error } = validationCreatePromo(req.body);
        if (error) {
            fs.unlinkSync(imagePath);
            return res.status(400).json({ message: error.details[0].message });
        }

        let promoCheck = await Promo.findOne({ promoCode: req.body.promoCode });
        if (promoCheck) {
            fs.unlinkSync(imagePath);
            return res.status(400).json({
                message: `This Promo Already Created before: ${req.body.promoCode}`
            });
        }

        const result = await cloudinaryUploadImage(imagePath);

        promoCheck = new Promo({
            promoCode: req.body.promoCode,
            discountPercentage: req.body.discountPercentage,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            usageLimit: req.body.usageLimit,
            usedCount: req.body.usedCount,
            promoTitle: req.body.promoTitle,
            companyId: req.user.companyId,
            promoDescription: req.body.promoDescription,
            promoImage: {
                url: result.secure_url,
                cloudinary_id: result.public_id
            }
        });

        await promoCheck.save();

        res.status(201).json({
            message: "New promo code added successfully",
            promo: promoCheck
        });

    } catch (err) {
        fs.unlinkSync(imagePath);
        return res.status(500).json({ message: "An error occurred", error: err.message });
    } finally {
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }
});


/**
 * @desc Get All Promo
 * @Route /api/promo
 * @method GET 
 * @access public
*/
module.exports.getAllPromoCodeController = asyncHandler(async (req, res) => {
    const { pageNumber, currentTime, limitPage, companyId, companyPageNumber, companyLimitPage } = req.query;
    let promo;

    if (pageNumber && currentTime && limitPage) {

        if (!currentTime) {
            return res.status(400).json({ message: "Current time is required" });
        }

        const dateFormat = "YYYY-MM-DDTHH:mm:ss";
        const userCurrentTime = moment(currentTime, dateFormat, true).utc();

        if (!userCurrentTime.isValid()) {
            return res.status(400).json({ message: "Invalid date format" });
        }

        const page = parseInt(pageNumber, 10);
        const limit = parseInt(limitPage, 10);

        if (isNaN(page) || page <= 0 || isNaN(limit) || limit <= 0) {
            return res.status(400).json({ message: "Invalid pagination values" });
        }

        promo = await Promo.find({
            startDate: { $lte: currentTime },
            endDate: { $gte: currentTime }
        }).skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 });
    } else if (companyId && companyPageNumber && companyLimitPage) {
        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(400).json({ message: "Invalid Object ID" });
        } else {
            const page = parseInt(companyPageNumber, 10);
            const limit = parseInt(companyLimitPage, 10);

            if (isNaN(page) || page <= 0 || isNaN(limit) || limit <= 0) {
                return res.status(400).json({ message: "Invalid pagination values" });
            } else {
                promo = await Promo.find({ companyId: companyId }).skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 });
            }
        }
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
    const promo = await Promo.findById(req.params.id).populate("Company");
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
 * @access private (only admin)
*/
module.exports.updatePromoCodeController = asyncHandler(async (req, res) => {
    const { error } = validationUpdatePromo(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    const updatePromo = await Promo.findByIdAndUpdate(req.params.id, {
        $set: {
            promoCode: req.body.promoCode,
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
 * @access private (only employee)
*/
module.exports.deleteOnePromoController = asyncHandler(async (req, res) => {
    // @TODO remove all getPromo by promoID
    const promoCheck = await Promo.findById(req.params.id);
    if (!promoCheck) {
        res.status(404).json({ message: "Promo not found" });
    } else {
        await cloudinaryRemoveImage(promoCheck.promoImage.cloudinary_id);
        await Promo.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Promo has been succefully deleted" });
    }
});


/**
 * @desc upload promo image 
 * @Route /api/promo/upload-image/:id
 * @method POST
 * @access private (only employee)
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


/**
 * @desc count how many promo
 * @Route /api/promo/count
 * @method GET
 * @access public
*/
module.exports.countPromoController = asyncHandler(async (req, res) => {
    const { companyId } = req.query;
    let promoCount;

    if (companyId) {
        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(400).json({ message: "Invalid Object ID" });
        } else {
            promoCount = await Promo.countDocuments({ companyId });
        }
    } else {
        promoCount = await Promo.countDocuments();
    }

    res.status(200).json({ promoCount });
});
