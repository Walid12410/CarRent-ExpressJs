const { ObjectId } = require('mongodb');

const bookingCompanyAggregation = (companyId) => [
    {
        $lookup: {
            from: "carrents", // Corrected from "form" to "from"
            localField: "carId",
            foreignField: "_id",
            as: "car",
        },
    },
    {
        $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
        },
    },
    {
        $unwind: {
            path: "$car",
            preserveNullAndEmptyArrays: true,
        },
    },
    {
        $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true,
        },
    },
    {
        $sort: {
            isDelivered: 1,
        },
    },
    {
        $match: {
            "car.companyId": new ObjectId(companyId),
        },
    },
    {
        $lookup: {
            from: "carimages",
            localField: "car._id",
            foreignField: "carRentID",
            as: "CarImage",
        },
    },
];

module.exports = bookingCompanyAggregation;
