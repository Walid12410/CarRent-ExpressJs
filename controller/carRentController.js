const asyncHandler = require("express-async-handler");
const { CarRent,
    validationCreateCarRent,
    validationUpdateCarRent
} = require("../model/CarRent");
const { Companies } = require("../model/Company");
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
    if (invalidIdCheck(req.body.companyId) || invalidIdCheck(req.body.categoryId)) {
        return res.status(400).json({ message: "Invalid Object ID" });
    }

    const { companyId, categoryId } = req.body;

    const [companyFound, categoryFound] = await Promise.all([
        Companies.findOne({ _id: companyId }),
        Category.findOne({ _id: categoryId }),
    ]);

    if (!companyFound) return res.status(400).json({ message: "Company not found" });
    if (!categoryFound) return res.status(400).json({ message: "Category not found" });

    if (req.body.carMake && !mongoose.Types.ObjectId.isValid(req.body.carMake)) {
        return res.status(400).json({ message: "Invalid Object ID for carMake" });
    }

    const newCarRent = new CarRent({ ...req.body });
    await newCarRent.save();

    res.status(201).json({ message: "New car rent has been created successfully" });
});

/**
 * @desc Get All Car
 * @Route /api/car-rent/car-image/:id
 * @method POST
 * @access private (only Employee)
*/
module.exports.AddCarImagesController = asyncHandler(async (req, res) => {
    const { files } = req;
    const { id: carRentID } = req.params;

    if (!files || !carRentID) {
        return res.status(400).json({ message: 'Files or CarRent ID missing' });
    }

    const carRent = await CarRent.findById(carRentID);
    if (!carRent) {
        return res.status(400).json({ message: 'CarRent ID not found' });
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
 * @desc Get All Car
 * @Route /api/car-rent
 * @method GET
 * @access public
*/
module.exports.getAllCarRentController = asyncHandler(async (req, res) => {
    const DEFAULT_CART_RENT_PER_PAGE = 3;
    const { pageNumber, pageNumberCat, category, company, car_rent_per_page,
        isAdmin, topRated, companyPageNumber, companyLimitPage, TopRatedPageNumber,
        TopRatedLimitPage, categoryLimitPage
    } = req.query;
    const carsPerPage = car_rent_per_page ? parseInt(car_rent_per_page) : DEFAULT_CART_RENT_PER_PAGE;
    const companyPerPage = companyLimitPage ? parseInt(companyLimitPage) : DEFAULT_CART_RENT_PER_PAGE;
    const topRatedPerPage = TopRatedLimitPage ? parseInt(TopRatedLimitPage) : DEFAULT_CART_RENT_PER_PAGE;
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
            cars = await CarRent.aggregate([...carRentAdminAggregation]);
        }
    } else {
        if (pageNumber) {
            cars = await CarRent.aggregate([
                ...carRentAggregation,
                { $skip: (pageNumber - 1) * carsPerPage },
                { $limit: carsPerPage }
            ]);
        } else if (category) {
            if (!category || !mongoose.Types.ObjectId.isValid(category)) {
                return res.status(400).json({ message: "Invalid Object ID" });
            }
            if (pageNumberCat) {
                cars = await CarRent.aggregate([
                    { $match: { categoryId: new mongoose.Types.ObjectId(category), carStatus: "Available" } },
                    ...carRentAggregation,
                    { $skip: (pageNumberCat - 1) * categoryPerPage },
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
                    ...carRentTopRatedAggregation,
                    { $skip: (TopRatedPageNumber - 1) * topRatedPerPage },
                    { $limit: topRatedPerPage }
                ]);
            } else {
                cars = await CarRent.aggregate([...carRentTopRatedAggregation]);
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
    const car = await CarRent.aggregate([...getOneCarRentAggregation(req.params.id)]);
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
 * @access private(only employee)
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
    const carRentCount = await CarRent.countDocuments();
    res.status(200).json(carRentCount);
});