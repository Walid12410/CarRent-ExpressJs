const asyncHandler = require("express-async-handler");
const { CarRent,
    validationCreateCarRent,
    validationUpdateCarRent
} = require("../model/CarRent");
const { Companies } = require("../model/Company");
const mongoose = require("mongoose");
const { Category } = require("../model/Category");
const CarImage = require("../model/CarRentImage");
const { cloudinaryUploadImage,cloudinaryRemoveImage } = require("../utils/cloudinary");
const path = require("path");
const fs = require("fs");


/**
 * @desc Create new Car rent
 * @Route /api/car-rent
 * @method POST
 * @access private (only Employee)
*/
module.exports.createCarRentController = asyncHandler(async (req, res) => {
    const { error } = validationCreateCarRent(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    if (!req.body.companyId || !mongoose.Types.ObjectId.isValid(req.body.companyId)) {
        return res.status(400).json({ message: "Invalid Object ID" });
    }

    if (!req.body.categoryId || !mongoose.Types.ObjectId.isValid(req.body.categoryId)) {
        return res.status(400).json({ message: "Invalid Object ID" });
    }

    let companyFound = await Companies.findOne({ _id: req.body.companyId });
    if (!companyFound) {
        return res.status(400).json({ message: "Company not found" });
    }

    let categoryFound = await Category.findOne({ _id: req.body.categoryId });
    if (!categoryFound) {
        return res.status(400).json({ message: "Category not found " })
    }

    let CarRentCreate = new CarRent({
        carMake: req.body.carMake,
        carModel: req.body.carModel,
        year: req.body.year,
        color: req.body.color,
        carType: req.body.carType,
        carStatus: req.body.carStatus,
        companyId: req.body.companyId,
        licensePlate: req.body.licensePlate,
        vin: req.body.vin,
        mileage: req.body.mileage,
        fuelType: req.body.fuelType,
        transmission: req.body.transmission,
        rentPrice: req.body.rentPrice,
        categoryId: req.body.categoryId
    });

    CarRentCreate.save();

    res.status(201).json({ message: "New car rent has been created succesfully" });
});


/**
 * @desc Get All Car
 * @Route /api/car-rent/upload-images
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
                carRentID : carRentID,
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
 * @access Public
*/
module.exports.getAllCarRentController = asyncHandler(async (req, res) => {
    const CART_RENT_PER_PAGE = 5;
    const { pageNumber, category, company } = req.query;
    let cars;

    if (pageNumber) {
        cars = await CarRent.find()
            .skip((pageNumber - 1) * CART_RENT_PER_PAGE)
            .limit(CART_RENT_PER_PAGE)
            .sort({ createdAt: -1 })
            .populate("category").populate("CarImage");
    } else if (category) {
        if (!category || !mongoose.Types.ObjectId.isValid(category)) {
            return res.status(400).json({ message: "Invalid Object ID" });
        }

        cars = await CarRent.find({ categoryId: category })
            .sort({ createdAt: -1 })
            .populate("category").populate("CarImage");
    } else if (company) {
        if (!company || !mongoose.Types.ObjectId.isValid(company)) {
            return res.status(400).json({ message: "Invalid Object ID" });
        }

        cars = await CarRent.find({ companyId: company })
            .sort({ createdAt: -1 })
            .populate("category").populate("CarImage");
    } else {
        cars = await CarRent.find().sort({ createdAt: -1 })
            .populate("category").populate("CarImage");
    }
    res.status(200).json(cars);
});


/**
 * @desc Get One Car By ID
 * @Route /api/car-rent/:id
 * @method GET
 * @access Public
*/
module.exports.getOneCarRentController = asyncHandler(async (req, res) => {
    const car = await CarRent.findById(req.params.id).populate({
        path: "companyDetails",
        populate: { path: "imageCompany", match: { isDefaultImage: true } }
    }).populate("CarImage");
    if (car) {
        res.status(200).json(car);
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

    const updateCarRent = await CarRent.findByIdAndUpdate(req.params.id, {
        $set: {
            carMake: req.body.carMake,
            carModel: req.body.carModel,
            year: req.body.year,
            color: req.body.color,
            carType: req.body.carType,
            carStatus: req.body.carStatus,
            licensePlate: req.body.licensePlate,
            vin: req.body.vin,
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
 * @desc Update Car By ID
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
 * @access PUBLIC
*/
module.exports.countAllCarRentController = asyncHandler(async (req, res) => {
    const carRentCount = await CarRent.countDocuments();
    res.status(200).json({ CarRentTotal: carRentCount });
});