const asyncHandler = require("express-async-handler");
const { CarRent, validationCreateCarRent, validationUpdateCarRent } = require("../model/CarRent");
const { Companies } = require("../model/Company");
const mongoose = require("mongoose");
const { Category } = require("../model/Category");


/**
 * @desc Create new Car rent
 * @Route /api/car-rent
 * @method POST
 * @access Private (only Employee)
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
 * @Route /api/car-rent
 * @method GET
 * @access Public
*/
module.exports.getAllCarRentController = asyncHandler(async (req, res) => {
    const cars = await CarRent.find();
    res.status(200).json(cars);
});


/**
 * @desc Get One Car By ID
 * @Route /api/car-rent/:id
 * @method GET
 * @access Public
*/
module.exports.getOneCarRentController = asyncHandler(async (req, res) => {
    const car = await CarRent.findById(req.params.id);
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

    let carFound = await CarRent.findOne({_id : req.params.id});
    if(!carFound){
        return res.status(404).json({message : "Car Not Found"});
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

    // @TODO Delete Car Rent Image

    await CarRent.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Car rent and its images has been deleted successfully" });
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