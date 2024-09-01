const asyncHandler = require("express-async-handler");
const { Promo } = require("../model/Prome");
const mongoose = require("mongoose");
const { GetPromo } = require("../model/GetPromo");



/**
 * @desc Get Promo Code
 * @Route /api/promo/claim
 * @method POST
 * @access private (only user)
*/
module.exports.getPromoCodeController = asyncHandler(async (req, res) => {

    const { promoId, userId, claimAt } = req.body;

    if (!mongoose.isValidObjectId(promoId)) {
        return res.status(400).json({ message: "Invalid promotion ID" });
    }
    if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    const promo = await Promo.findById(promoId);
    if (!promo) {
        return res.status(404).json({ message: "Promotion not found" });
    }

    if (promo.status !== "Active" || claimAt < promo.startDate || claimAt > promo.endDate) {
        return res.status(400).json({ message: "Promotion is not active or has expired" });
    }

    const existingClaim = await GetPromo.findOne({ userId: userId, promoId: promoId });
    if (existingClaim) {
        return res.status(400).json({ message: "You have already claimed this promotion" });
    }

    const newClaim = new GetPromo({
        userId,
        promoId: promo._id,
        claimedAt: claimAt,
        startDate: promo.startDate,
        endDate: promo.endDate
    });

    await newClaim.save();

    res.status(201).json({ message: "Promotion claimed successfully" });
});


/**
 * @desc Use Promo Code
 * @Route /api/promo/use
 * @method POST
 * @access private (only user)
*/
module.exports.usePromoCodeController = asyncHandler(async (req, res) => {
    const { userId, promoCode, currentTime } = req.body;

    if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    const promo = await Promo.findOne({ promoCode });
    if (!promo) {
        return res.status(404).send({ message: 'Promotion not found' });
    }

    const getPromo = await GetPromo.findOne({ userId, promoId: promo._id });
    if (!getPromo) {
        return res.status(400).json({ message: "You have not claimed this promotion" });
    }

    if (getPromo.isUsed) {
        return res.status(400).json({ message: "Promotion has already been userd" });
    }

    if (currentTime < getPromo.startDate || currentTime > getPromo.endDate) {
        return res.status(400).json({ message: "Promotion is expired" });
    }

    getPromo.isUsed = true;
    await getPromo.save();

    promo.usedCount += 1;
    await promo.save();

    res.status(200).json({ message: "Promtion used successfully" });
});


/**
 * @desc Check Promo Code
 * @Route /api/promo/check-user-promotion
 * @method GET
 * @access private (only user)
*/
module.exports.checkPromoCodeController = asyncHandler(async (req, res) => {
    const { userId, promoCode, currentDate, companyID } = req.body;

    if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    if (!mongoose.isValidObjectId(companyID)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    const promo = await Promo.findOne({ promoCode });
    if (!promo) {
        return res.status(404).send({ message: 'Promotion not found' });
    }

    if (promo.companyID != companyID) {
        return res.status(404).send({ message: 'This promition is not for this company car' });
    }

    const getPromo = await GetPromo.findOne({ userId, promoId: promo._id }).populate('promoDetails');
    if (!getPromo) {
        return res.status(400).json({ message: "You have not claimed this promotion" });
    }

    if (getPromo.isUsed) {
        return res.status(400).send({ message: 'Promotion has already been used' });
    }

    if (currentDate < getPromo.startDate || currentDate > getPromo.endDate) {
        return res.status(400).send({ message: 'Promotion is expired' });
    }

    res.status(200).json({ message: "Promotion found", promoDetails: getPromo.promoDetails });
});

