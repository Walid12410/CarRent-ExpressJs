const asyncHandler = require("express-async-handler");
const { CarMake, validationCreateCarMake, validationUpdateCarMake
} = require("../model/CarMake");
const { CarRent } = require("../model/CarRent");


/**
 * @desc Create new car make
 * @Route /api/car-make
 * @method POST
 * @access private (only Admin)
*/
module.exports.createNewCarMakeController = asyncHandler(async (req, res) => {
    const { error } = validationCreateCarMake(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    let carMake = await CarMake.findOne({ carMakeName: req.body.carMakeName });
    if (carMake) {
        return res.status(400).json({ message: "Car make name already created before" });
    }

    carMake = new CarMake({
        carMakeName: req.body.carMakeName
    });

    await carMake.save();

    res.status(201).json({ message: "Car make name added successfully" });
});


/**
 * @desc get all car make name
 * @Route /api/car-make
 * @method GET
 * @access public 
*/
module.exports.getAllCarMakeController = asyncHandler(async (req, res) => {
    const carMakes = await CarMake.find();
    res.status(200).json(carMakes);
});


/**
 * @desc update car make name
 * @Route /api/car-make/:id
 * @method PUT
 * @access private (only admin) 
*/
module.exports.updateCarMakeController = asyncHandler(async (req, res) => {
    const { error } = validationUpdateCarMake(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const updateCarMakeName = await CarMake.findByIdAndUpdate(req.params.id, {
        $set: {
            carMakeName: req.body.carMakeName
        }
    }, { new: true });

    if (updateCarMakeName) {
        return res.status(404).json({ message: "car make id not found" });
    }

    res.status(201).json(updateCarMakeName);
});


/**
 * @desc Delete car make name
 * @Route /api/car-make/:id
 * @method DELETE
 * @access private (only admin) 
*/
module.exports.deleteCarMakeController = asyncHandler(async (req, res) => {
    const carMake = await CarMake.findById(req.params.id);
    if (!carMake) {
        return res.status(404).json({ message: "Car make not found" });
    }

    let carMakeCheck = await CarRent.find({ carMake: req.params.id });
    if (carMakeCheck.length > 0) {
        return res.status(404).json({ message: "This carMake already used in CarRent and cannot deleted" });
    }

    await CarMake.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "CarMake has been deleted successfully" });
});

