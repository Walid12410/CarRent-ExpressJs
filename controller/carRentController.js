const asyncHandler = require("express-async-handler");
const { CarRent,
    validationCreateCarRent,
    validationUpdateCarRent
} = require("../model/CarRent");
const { CarMake } = require("../model/CarMake");
const mongoose = require("mongoose");
const { Category } = require("../model/Category");
const CarImage = require("../model/CarRentImage");
const { cloudinaryUploadImage, cloudinaryRemoveImage } = require("../utils/cloudinary");
const path = require("path");
const fs = require("fs");
const { carRentAggregation,
    carRentAdminAggregation,
    carRentTopRatedAggregation,
    getOneCarRentAggregation,
    companyCarAggregation
} = require("../aggregation/carRentAggregation");
const { validateObjectId } = require("../middlewares/helperFunction");
const { url } = require("inspector");


/**
 * @desc Create new Car rent
 * @Route /api/car-rent
 * @method POST
 * @access private (only Employee)
*/
module.exports.createCarRentController = asyncHandler(async (req, res) => {
    const { error } = validationCreateCarRent(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const invalidIdCheck = id => !id || !mongoose.Types.ObjectId.isValid(id);
    if (invalidIdCheck(req.body.carMakeId) || invalidIdCheck(req.body.categoryId)) {
        return res.status(400).json({ message: "Invalid Object ID" });
    }

    const { carMakeId, categoryId } = req.body;

    const [carMakeFound, categoryFound] = await Promise.all([
        CarMake.findOne({ _id: carMakeId }),
        Category.findOne({ _id: categoryId }),
    ]);

    if (!carMakeFound) return res.status(400).json({ message: "car make not found" });
    if (!categoryFound) return res.status(400).json({ message: "Category not found" });


    const newCarRent = new CarRent({
        carMakeId: req.body.carMakeId,
        carModel: req.body.carModel,
        categoryId: req.body.categoryId,
        year: req.body.year,
        color: req.body.color,
        carStatus: req.body.carStatus,
        licensePlate: req.body.licensePlate,
        mileage: req.body.mileage,
        fuelType: req.body.fuelType,
        transmission: req.body.transmission,
        rentPrice: req.body.rentPrice,
        companyId: req.user.companyId
    });
    await newCarRent.save();

    res.status(201).json({
        message: "New car rent has been created successfully",
        carId: newCarRent._id
    });
});


/**
 * @desc Add car image
 * @Route /api/car-rent/car-image/:id
 * @method POST
 * @access private (only Employee)
*/
module.exports.AddCarImagesController = asyncHandler(async (req, res) => {
    const { files } = req;
    const { id: carRentID } = req.params;

    if (!files || !carRentID) {
        return res.status(400).json({ message: 'Files or carRent id missing' });
    }

    const carRent = await CarRent.findById(carRentID);
    if (!carRent) {
        return res.status(400).json({ message: 'Car rent id not found' });
    }

    const uploadedImages = [];

    try {
        for (const file of files) {
            const imagePath = path.join(__dirname, `../images/${file.filename}`);
            const result = await cloudinaryUploadImage(imagePath);

            if (!result?.public_id) {
                throw new Error('Image upload failed');
            }

            const newImage = new CarImage({
                carRentID: carRentID,
                carImage: { url: result.secure_url, cloudinary_id: result.public_id },
            });

            await newImage.save();
            uploadedImages.push(newImage);

            // Clean up local image
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        res.status(200).json({ message: 'Car images uploaded successfully', carImages: uploadedImages });
    } catch (err) {
        res.status(500).json({ message: err.message });
    } 
});


/**
 * @desc Change car image
 * @Route /api/car-rent/change-image/:id
 * @method POST
 * @access private (only Employee)
*/
module.exports.changeCarImageController = asyncHandler(async (req,res)=> {
    if(!req.file) return res.status(400).json({message : "No file provided"});

    const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
    const result = await cloudinaryUploadImage(imagePath);
    const carImage = await CarImage.findById(req.params.id);

    if(carImage.carImage && carImage.carImage.cloudinary_id){
        await cloudinaryRemoveImage(carImage.carImage.cloudinary_id);
    }

    carImage.carImage = {url : result.secure_url, cloudinary_id : result.public_id};
    await carImage.save(); // Save the new image

    res.status(200).json({message : "Image updated successfully", carImage : {
        url : result.secure_url, cloudinary_id : result.public_id
    }});

    fs.unlinkSync(imagePath);
});


/**
 * @desc Get All Car
 * @Route /api/car-rent
 * @method GET
 * @access public
*/
module.exports.getAllCarRentController = asyncHandler(async (req, res) => {
    const DEFAULT_CART_RENT_PER_PAGE = 3;
    const DEFAULT_CART_RENT_PAGE_NUMBER = 1;
    const { pageNumber, perPage, pageNumberCat, category, company, car_rent_per_page,
        isAdmin, topRated, companyPageNumber, companyLimitPage, TopRatedPageNumber,
        TopRatedLimitPage, categoryLimitPage
    } = req.query;

    const latestCarPerPage = perPage ? parseInt(perPage) : DEFAULT_CART_RENT_PER_PAGE;
    const carsPerPage = car_rent_per_page ? parseInt(car_rent_per_page) : DEFAULT_CART_RENT_PER_PAGE;
    const companyPerPage = companyLimitPage ? parseInt(companyLimitPage) : DEFAULT_CART_RENT_PER_PAGE;
    const topRatedPerPage = TopRatedLimitPage ? parseInt(TopRatedLimitPage) : DEFAULT_CART_RENT_PER_PAGE;

    const pagePerCategory = pageNumberCat ? parseInt(pageNumberCat) : DEFAULT_CART_RENT_PAGE_NUMBER;
    const categoryPerPage = categoryLimitPage ? parseInt(categoryLimitPage) : DEFAULT_CART_RENT_PER_PAGE;

    let cars;

    if (isAdmin) {
        if (pageNumber) {
            cars = await CarRent.aggregate([
                ...carRentAdminAggregation,
                { $skip: (pageNumber - 1) * carsPerPage },
                { $limit: carsPerPage }
            ]);
        } else {
            cars = await CarRent.aggregate([
                ...carRentAdminAggregation
            ]);
        }
    } else {
        if (pageNumber) {
            cars = await CarRent.aggregate([
                { $match: { carStatus: "Available" } },
                ...carRentAggregation,
                { $skip: (pageNumber - 1) * latestCarPerPage },
                { $limit: latestCarPerPage }
            ]);
        } else if (category) {
            if (!category || !mongoose.Types.ObjectId.isValid(category)) {
                return res.status(400).json({ message: "Invalid Object ID" });
            }
            if (pageNumberCat) {
                cars = await CarRent.aggregate([
                    { $match: { categoryId: new mongoose.Types.ObjectId(category), carStatus: "Available" } },
                    ...carRentAggregation,
                    { $skip: (pagePerCategory - 1) * categoryPerPage },
                    { $limit: categoryPerPage }
                ]);
            } else {
                cars = await CarRent.aggregate([
                    { $match: { categoryId: new mongoose.Types.ObjectId(category), carStatus: "Available" } },
                    ...carRentAggregation,
                ]);
            }
        } else if (company) {
            if (!company || !mongoose.Types.ObjectId.isValid(company)) {
                return res.status(400).json({ message: "Invalid Object ID" });
            }
            if (companyPageNumber) {
                cars = await CarRent.aggregate([
                    { $match: { companyId: new mongoose.Types.ObjectId(company) } },
                    ...companyCarAggregation,
                    { $skip: (companyPageNumber - 1) * companyPerPage },
                    { $limit: companyPerPage }
                ]);
            } else {
                cars = await CarRent.aggregate([
                    { $match: { companyId: new mongoose.Types.ObjectId(company) } },
                    ...companyCarAggregation,
                ]);
            }
        } else if (topRated) {
            if (TopRatedPageNumber) {
                cars = await CarRent.aggregate([
                    { $match: { carStatus: "Available" } },
                    ...carRentTopRatedAggregation,
                    { $skip: (TopRatedPageNumber - 1) * topRatedPerPage },
                    { $limit: topRatedPerPage }
                ]);
            } else {
                cars = await CarRent.aggregate([
                    { $match: { carStatus: "Available" } },
                    ...carRentTopRatedAggregation
                ]);
            }
        } else {
            cars = await CarRent.find().sort({ createdAt: -1 })
                .populate("category").populate("CarImage");
        }
    }
    res.status(200).json(cars);
});


/**
 * @desc Get One Car By ID
 * @Route /api/car-rent/:id
 * @method GET
 * @access public
*/
module.exports.getOneCarRentController = asyncHandler(async (req, res) => {
    const car = await CarRent.aggregate([
        {$match : {_id : new mongoose.Types.ObjectId(req.params.id)} },
        ...getOneCarRentAggregation]);
    if (car.length > 0) {
        res.status(200).json(car[0]); // Return the car object
    } else {
        res.status(404).json({ message: "Car not found" });
    }
});



/**
 * @desc Update Car By ID
 * @Route /api/car-rent/:id
 * @method PUT
 * @access private (only employee)
*/
module.exports.updateOneCarRentController = asyncHandler(async (req, res) => {
    const { error } = validationUpdateCarRent(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    let carFound = await CarRent.findOne({ _id: req.params.id });
    if (!carFound) {
        return res.status(404).json({ message: "Car Not Found" });
    }

    if (req.body.categoryId) {
        if (!mongoose.Types.ObjectId.isValid(req.body.categoryId)) {
            return res.status(400).json({ message: "Invalid Object ID" });
        }
        let categoryFound = await Category.findOne({ _id: req.body.categoryId });
        if (!categoryFound) {
            return res.status(400).json({ message: "Category not found " });
        }
    }

    if (req.body.carMakeId && !mongoose.Types.ObjectId.isValid(req.body.carMakeId)) {
        return res.status(400).json({ message: "Invalid Object ID for carMake" });
    }

    const updateCarRent = await CarRent.findByIdAndUpdate(req.params.id, {
        $set: {
            carMake: req.body.carMakeId,
            carModel: req.body.carModel,
            year: req.body.year,
            color: req.body.color,
            carStatus: req.body.carStatus,
            licensePlate: req.body.licensePlate,
            mileage: req.body.mileage,
            fuelType: req.body.fuelType,
            transmission: req.body.transmission,
            rentPrice: req.body.rentPrice,
            categoryId: req.body.categoryId
        }
    }, { new: true });

    res.status(200).json(updateCarRent);
});


/**
 * @desc Delete Car By ID
 * @Route /api/car-rent/:id
 * @method DELETE
 * @access private(only employee)
*/
module.exports.deleteCarRentController = asyncHandler(async (req, res) => {
    const carFound = await CarRent.findById(req.params.id);
    if (!carFound) {
        return res.status(404).json({ message: "Car not found" });
    }

    const images = await CarImage.find({ carRentID: req.params.id });

    for (const image of images) {
        try {
            await cloudinaryRemoveImage(image.carImage.cloudinary_id);
        } catch (err) {
            console.error(`Failed to delete image with Cloudinary ID ${image.carImage.cloudinary_id}:`, err.message);
        }
    }

    await CarImage.deleteMany({ carRentID: req.params.id });

    await CarRent.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Car rent and its images have been deleted successfully" });
});


/**
 * @desc Count how many carRent
 * @Route /api/car-rent/count
 * @method GET
 * @access public
*/
module.exports.countAllCarRentController = asyncHandler(async (req, res) => {
    const { companyId } = req.query;
    let carRentCount;

    if (companyId) {
        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(400).json({ message: "Invalid Object ID" });
        } else {
            carRentCount = await CarRent.countDocuments({ companyId });
        }
    } else {
        carRentCount = await CarRent.countDocuments();
    }

    res.status(200).json({ carRentCount });
});



/**
 * @desc Search for specific car
 * @Route /api/car-rent/search
 * @method POST
 * @access public
*/
module.exports.searchCarController = asyncHandler(async (req, res) => {
    const { carMakeId, categoryId, companyId, carModel, priceMin, priceMax, page = 1, limit = 10 } = req.body;

    const query = {};

    // Handle rent price range (assuming price is stored as a string)
    if (priceMin && priceMax) {
        query.rentPrice = { $gte: parseFloat(priceMin), $lte: parseFloat(priceMax) };
    }

    query.carStatus = "Available";

    // Validate and handle carMakeId
    if (carMakeId) {
        if (!validateObjectId(carMakeId)) {
            return res.status(400).json({ message: "Invalid car make" });
        }
        query.carMakeId = carMakeId;
    }

    // validate and handle companyId
    if(companyId) {
        if(!validateObjectId(companyId)){
            return res.status(400).json({message : "Invalid company"});
        }
        query.companyId = companyId;
    }

    // Handle multiple categoryIds from the body
    if (categoryId) {
        // Ensure categoryId is an array
        const categories = Array.isArray(categoryId) ? categoryId : categoryId.split(',').map(id => id.trim());
        
        // Ensure all values are valid ObjectIds
        if (categories.some(id => !validateObjectId(id))) {
            return res.status(400).json({ message: "One or more invalid category IDs" });
        }
        
        // Use $in operator to match any of the categoryIds
        query.categoryId = { $in: categories };
    }

    // Handle carModel search (partial match, case-insensitive)
    if (carModel) {
        query.carModel = { $regex: new RegExp(carModel, 'i') };  // 'i' makes the search case-insensitive
    }

    // Fetch the results
    const result = await CarRent.find(query)
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate("CarImage");

    // Count total results
    const total = await CarRent.countDocuments(query);

    res.status(200).json({
        success: true,
        data: result,
        total,
        currentPage: parseInt(page),
        totalPage: Math.ceil(total / limit)
    });
});

