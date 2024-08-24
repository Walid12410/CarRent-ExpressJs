const asyncHandler = require("express-async-handler");
const { Companies,
    validationCompainesCreate,
    validationComapainesUpdate
} = require("../model/Companies");


/**
 * @desc Create new company
 * @Route /api/companies/list
 * @method POST
 * @access Private (only Admin)
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
        CompanyPhoneNumber: req.body.CompanyPhoneNumber,
        CompanyAddress: req.body.CompanyAddress,
        CompanyCity: req.body.CompanyCity,
        CompanyState: req.body.CompanyState
    });

    company.save();

    res.status(201).json({ message: "New company added successfully" });
});


/**
 * @desc Get All Companies
 * @Route /api/companies/list
 * @method GET
 * @access Public
*/
module.exports.getAllCompaniesController = asyncHandler(async (req, res) => {
    const companies = await Companies.find();
    res.status(200).json(companies);
});


/**
 * @desc Get One Company
 * @Route /api/companies/list/:id
 * @method GET
 * @access Public
*/
module.exports.getOneCompanyController = asyncHandler(async (req, res) => {
    const companies = await Companies.findById(req.params.id);
    if (companies) {
        res.status(200).json(companies);
    } else {
        res.status(404).json({ message: "Company Not Found" });
    }
});


/**
 * @desc Update Company Details
 * @Route /api/companies/list/:id
 * @method PUT
 * @access private (Admin Only)
*/
module.exports.updateCompanyController = asyncHandler(async(req,res)=>{
    const {error} = validationComapainesUpdate(req.body);
    if(error){
        return res.status(400).json({message : error.details[0].message});
    }

    const updateCompany = await Companies.findByIdAndUpdate(req.params.id,{
        $set: {
            companyName: req.body.companyName,
            companyEmail: req.body.companyEmail,
            CompanyPhoneNumber: req.body.CompanyPhoneNumber,
            CompanyAddress: req.body.CompanyAddress,
            CompanyCity: req.body.CompanyCity,
            CompanyState: req.body.CompanyState    
        }
    },{new : true});

    res.status(200).json(updateCompany);
});

/**
 * @desc Count All User
 * @Route /api/company/count
 * @method GET
 * @access private(only Admin)
*/
module.exports.CountAllCompaniesController = asyncHandler(async(req,res)=>{
    const countCompanies = await Companies.countDocuments();
    res.status(200).json({Count : countCompanies});
});

/**
 * @desc Delete Company
 * @Route /api/companies/list/:id
 * @method DELETE
 * @access private (Admin Only)
*/
module.exports.deleteCompanyController = asyncHandler(async(req,res)=>{
    const comapanyFound = await Companies.findById(req.params.id);
    if(!comapanyFound){
        res.status(404).json({message : "Company not found"});
    }

    if(req.user.isAdmin){
        await Companies.findByIdAndDelete(req.params.id);
        res.status(200).json({message : "Company has been deleted successfully"});
    }else{
        res.status(403).json({message : "access denied, forbidden"});
    }
});