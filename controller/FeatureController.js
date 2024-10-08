const asyncHandler = require("express-async-handler");
const { Feature,
    validationCreateFeature,
    validationUpdateFeature
} = require("../model/Feature");
const { CarRent } = require("../model/CarRent");
const { getFeatureAggregation } = require("../aggregation/featureAggregation");
const moment = require("moment");

/**
 * @desc Create new feature
 * @Route /api/feature/:id
 * @method POST
 * @access private (only admin)
*/
module.exports.createNewFeatureController = asyncHandler(async (req, res) => {
    const { error } = validationCreateFeature(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    let carCheck = await CarRent.findOne({ _id: req.params.id });
    if (!carCheck) {
        return res.status(404).json({ message: "Car not found" });
    }

    let feature = new Feature({
        carId: req.params.id,
        startDate: req.body.startDate,
        endDate: req.body.endDate
    });

    await feature.save();

    res.status(201).json({ message: "Feature created successfully" });
});


/**
 * @desc Get future
 * @Route /api/feature
 * @method GET
 * @access public
*/
module.exports.getAllFeatureController = asyncHandler(async (req, res) => {
    const { pageNumber, currentTime, limitPage } = req.query;
    let feature;

    if (pageNumber && currentTime && limitPage) {

        if (!currentTime) {
            return res.status(400).json({ message: "Current time is required" });
        }

        const dateFormat = "YYYY-MM-DDTHH:mm:ss";
        const userCurrentTime = moment(currentTime, dateFormat, true).utc();

        if (!userCurrentTime.isValid()) {
            return res.status(400).json({ message: "Invalid date format" });
        }

        let aggregationPipeline = getFeatureAggregation(userCurrentTime.toDate());

        const page = parseInt(pageNumber, 10);
        const limit = parseInt(limitPage, 10);

        if (isNaN(page) || page <= 0 || isNaN(limit) || limit <= 0) {
            return res.status(400).json({ message: "Invalid pagination values" });
        }
        if (pageNumber) {
            aggregationPipeline.push(
                { $skip: (page - 1) * limit },
                { $limit: limit }
            );
        }
        feature = await Feature.aggregate(aggregationPipeline);
    } else {
        feature = await Feature.find();
    }

    res.status(200).json(feature);
});


/**
 * @desc update future
 * @Route /api/feature/:id
 * @method PUT
 * @access private (only admin)
*/
module.exports.updateFeatureController = asyncHandler(async (req, res) => {
    const { error } = validationUpdateFeature(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const updateFeature = await Feature.findByIdAndUpdate(req.params.id, {
        $set: {
            startDate: req.body.startDate,
            endDate: req.body.endDate
        }
    }, { new: true });

    if (!updateFeature) {
        return res.status(404).json({ message: "Feature not found" });
    }

    res.status(200).json(updateFeature);
});


/**
 * @desc delete future
 * @Route /api/feature/:id
 * @method DELETE
 * @access private(only admin)
*/
module.exports.deleteFeatureController = asyncHandler(async (req, res) => {
    const featureFound = await Feature.findById(req.params.id);
    if (!featureFound) {
        return res.status(404).json({ message: "Feature not found" });
    }

    await Feature.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Feature deleted successfully" });
});