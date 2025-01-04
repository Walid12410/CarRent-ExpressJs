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
            createdAt: -1,
        },
    },
    {
        $project: {
            "user.password": 0, // Exclude user password field
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


const countBookingsForCompanyAggregation = (companyId) => [
    {
        $lookup: {
            from: "carrents",
            localField: "carId",
            foreignField: "_id",
            as: "car",
        },
    },
    {
        $unwind: {
            path: "$car",
            preserveNullAndEmptyArrays: false, // Only include bookings with a car
        },
    },
    {
        $match: {
            "car.companyId": new ObjectId(companyId),
        },
    },
    {
        $group: {
            _id: "$car.companyId",
            bookingCount: { $sum: 1 }, // Count the number of bookings
        },
    },
    {
        $project: {
            _id: 0, // Exclude the `_id` field from the output
            companyId: "$_id",
            bookingCount: 1,
        },
    },
];

module.exports = { bookingCompanyAggregation, countBookingsForCompanyAggregation };
