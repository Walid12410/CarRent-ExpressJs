const asyncHandler = require("express-async-handler");
const { CompanyLocation,
    validationCreateCompayLocation,
    validationUpdateCompanyLocation
} = require("../model/CompanyLocation"); 


/**
 * @desc Create new company location
 * @Route /api/company-location/:id
 * @method POST
 * @access private (only Employee)
*/
module.exports.createNewCompanyLocation = asyncHandler(async(req,res)=>{
    const { error } = validationCreateCompayLocation(req.body);
    if(error){
        return res.status(400).json({message : error.details[0].message});
    }

    let locationFound = await CompanyLocation.findOne({companyId : req.params.id});
    if(locationFound) { 
        return res.status(400).json({message : "Location already created before, update it!"});
    }

    let createLocation = new CompanyLocation({
        companyId : req.params.id,
        latitude : req.body.latitude,
        longitude : req.body.longitude,
        address : req.body.address,
        city : req.body.city,
        country : req.body.country
    });

    await createLocation.save();
    
    res.status(201).json({message : "Location created successfully!"});
});


/**
 * @desc update company location
 * @Route /api/company-location/:id
 * @method PUT
 * @access private (only Employee)
*/
module.exports.updateCompanyLocationController = asyncHandler(async(req,res)=>{
    const { error } = validationUpdateCompanyLocation(req.body);
    if(error){
        return res.status(400).json({message: error.details[0].message});
    }

    let updateLocation = await CompanyLocation.findByIdAndUpdate(req.params.id,{
        $set : {
            latitude : req.body.latitude,
            longitude : req.body.longitude,
            address : req.body.address,
            city : req.body.city,
            country : req.body.country
        }
    },{new : true});

    if(!updateLocation){
        return res.status(404).json({message : "location not"});
    }

    res.status(200).json(updateLocation);
});


/**
 * @desc get all companies location
 * @Route /api/company-location
 * @method GET
 * @access public 
*/
module.exports.getAllCompanyLocationController = asyncHandler(async(req,res)=>{
    const companiesLocation = await CompanyLocation.find();
    res.status(200).json(companiesLocation);
});


/**
 * @desc update company location
 * @Route /api/company-location/:id
 * @method GET
 * @access public 
*/
module.exports.getOneCompanyLocationController = asyncHandler(async(req,res)=>{
    const locationFound = await CompanyLocation.findById(req.params.id);
    if(!locationFound){
        return res.status(404).json({message : "location not found"});
    }

    res.status(200).json(locationFound);
});


/**
 * @desc delete company location
 * @Route /api/company-location/:id
 * @method DELETE
 * @access private (only employee) 
*/
module.exports.deleteCompanyLocationController = asyncHandler(async(req,res)=>{
    const locationFound = await CompanyLocation.findById(req.params.id);
    if(!locationFound){
        return res.status(404).json({message : "location not found"});
    }

    await CompanyLocation.findByIdAndDelete(req.params.id);

    res.status(200).json({message : "location deleted successfully"});
});