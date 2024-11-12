const asyncHandler = require("express-async-handler");
const { Companies,
    validationCompainesCreate,
    validationComapainesUpdate
} = require("../model/Company");
const { CompanyImage } = require("../model/CompanyImage");
const { cloudinaryRemoveImage } = require("../utils/cloudinary");
const companyAggregation = require("../aggregation/companyAggregation");
const mongoose = require("mongoose");

/**
 * @desc Create new company
 * @Route /api/company/list
 * @method POST
 * @access private (only Admin)
*/
module.exports.ceateNewCompanyController = asyncHandler(async (req, res) => {
    const { error } = validationCompainesCreate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    let company = await Companies.findOne({ companyName: req.body.companyName });
    if (company) {
        return res.status(400).json({ message: "Company Already Created Before" });
    }

    company = new Companies({
        companyName: req.body.companyName,
        companyEmail: req.body.companyEmail,
        companyPhoneNumber: req.body.companyPhoneNumber,
        latitude: req.body.latitude,
        longitude : req.body.longitude,
        address : req.body.address,
        city : req.body.city,
        country: req.body.country
    });

    await company.save();

    res.status(201).json({ message: "New company added successfully" });
});


/**
 * @desc Get All Companies
 * @Route /api/company/list
 * @method GET
 * @access Public
*/
module.exports.getAllCompaniesController = asyncHandler(async (req, res) => {
    const limit = req.query.top === '3' ? 3 : 0;
    let companies;
    if(limit){
        companies = await Companies.aggregate([
            ...companyAggregation,
            {$limit : limit},
            {$sort: { createdAt : -1 }}
        ]);
    }else{
        companies = await Companies.aggregate([
            ...companyAggregation
        ]);
    }
    res.status(200).json(companies);
});

/**
 * @desc Get One Company
 * @Route /api/company/list/:id
 * @method GET
 * @access Public
*/
module.exports.getOneCompanyController = asyncHandler(async (req, res) => {
    const company = await Companies.aggregate([
        ...companyAggregation,
        {$match : { _id :new mongoose.Types.ObjectId(req.params.id) }}
    ]);
    if (company.length > 0) {
        res.status(200).json(company[0]);
    } else {
        res.status(404).json({ message: "Company Not Found" });
    }
});


/**
 * @desc Update Company Details
 * @Route /api/company/list/:id
 * @method PUT
 * @access private (Admin Only)
*/
module.exports.updateCompanyController = asyncHandler(async (req, res) => {
    const { error } = validationComapainesUpdate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const updateCompany = await Companies.findByIdAndUpdate(req.params.id, {
        $set: {
            companyName: req.body.companyName,
            companyEmail: req.body.companyEmail,
            companyPhoneNumber: req.body.companyPhoneNumber,
            latitude: req.body.latitude,
            longitude : req.body.longitude,
            address : req.body.address,
            city : req.body.city,
            country: req.body.country    
        }
    }, { new: true });

    if(!updateCompany){
        return res.status(404).json({message : "Company not found"});
    }

    res.status(200).json(updateCompany);
});

/**
 * @desc Count All User
 * @Route /api/company/count
 * @method GET
 * @access private(only Admin)
*/
module.exports.CountAllCompaniesController = asyncHandler(async (req, res) => {
    const countCompanies = await Companies.countDocuments();
    res.status(200).json({ Count: countCompanies });
});


/**
 * @desc Delete Company
 * @Route /api/company/list/:id
 * @method DELETE
 * @access private (Admin Only)
*/
module.exports.deleteCompanyController = asyncHandler(async (req, res) => {
    const companyFound = await Companies.findById(req.params.id);
    if (!companyFound) {
        return res.status(404).json({ message: "Company not found" });
    }

    const companyImages = await CompanyImage.find({ companyID: req.params.id });

    for (const image of companyImages) {
        if (image.image.cloudinary_id) {
            await cloudinaryRemoveImage(image.image.cloudinary_id);
        }

        await CompanyImage.findByIdAndDelete(image._id);
    }

    await Companies.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Company and its images have been deleted successfully" });
});