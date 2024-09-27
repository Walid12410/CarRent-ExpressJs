const asyncHandler = require("express-async-handler");
const { validationCreateLocation,
    UserLocation,
    validationUpdateLocation
} = require("../model/UserLocation"); 



/**
 * @desc Create new user location
 * @Route /api/user-location/:id
 * @method POST
 * @access private (only user himself)
*/
module.exports.createNewUserLocationController = asyncHandler(async(req,res) => {
    const {error} = validationCreateLocation(req.body);
    if(error){
        return res.status(400).json({message : error.details[0].message});
    }

    let locationFound = await UserLocation.findOne({userId : req.params.id});
    if(locationFound){
        return res.status(400).json({message : "location already created before, update it!"});
    }

    let createLocation = new UserLocation({
        userId : req.params.id,
        latitude : req.body.latitude,
        longitude : req.body.longitude,
        address : req.body.address,
        city : req.body.city,
        country : req.body.country
    });

    await createLocation.save();

    res.status(201).json({message : "location created successfully"});
});


/**
 * @desc update user location
 * @Route /api/user-location/:id
 * @method PUT
 * @access private (only user himself)
*/
module.exports.updateUserLocationController = asyncHandler(async(req,res)=> {
    const {error} = validationUpdateLocation(req.body);
    if(error){
        return res.status(400).json({message : error.details[0].message});
    }

    let updateLocation = await UserLocation.findByIdAndUpdate(req.params.id,{
        $set : {
            latitude : req.body.latitude,
            longitude : req.body.longitude,
            address : req.body.address,
            city : req.body.city,
            country : req.body.country
        }
    },{new : true});

    if(!updateLocation){
      return res.status(404).json({message : "Location not found"});
    }

    res.status(200).json(updateLocation);
});


/**
 * @desc Get User Location
 * @Route /api/user-location/:id
 * @method GET
 * @access public 
*/
module.exports.getUserLocationController = asyncHandler(async(req,res)=> {
    const userLocation = await UserLocation.findOne({userId : req.params.id});
    if(!userLocation){
        return res.status(404).json({message : "location not found"});
    }
    res.status(200).json(userLocation);
});


/**
 * @desc Delete User Location
 * @Route /api/user-location/:id
 * @method Delete
 * @access private(only user himeself or admin) 
*/
module.exports.deleteUserLocationController = asyncHandler(async(req,res)=> {
    const locationFound = await UserLocation.findById(req.params.id);
    if(!locationFound){
        return res.status(404).json({message : "location not found"});
    }

    await UserLocation.findByIdAndDelete(req.params.id);

    res.status(200).json({message : "location deleted successfully"});
});