const { ObjectId } = require("mongodb");

const reviewCompanyAggregation = (companyId) => [
    {
        $lookup: {
            from: "carrents",
            localField: "carId",
            foreignField: "_id",
            as: "car"
        }
    },
    {
        $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user"
        }
    },
    {
        $unwind: {
            path: "$car",
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $sort: {
            createdAt: -1
        }
    },
    {
        $project: {
            "user.password" : 0
        }
    },
    {
        $match: {
            "carId": { $exists: true },
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


const countReviewForCompanyAggregation = (companyId) => [
    {
        $lookup: {
            from: "carrents",
            localField: "carId",
            foreignField: "_id",
            as: "car"
        }
    },
    {
        $unwind: {
            path: "$car",
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $match: {
            "carId": { $exists: true },
            "car.companyId": new ObjectId(companyId),
        },
    },
    {
        $group : {
            _id : "$car.companyId",
            reviewCount : { $sum : 1},
        }
    },
    {
        $project : {
            _id : 0,
            companyId : "$_id",
            reviewCount : 1,
        }
    }
];


module.exports = {
    reviewCompanyAggregation,
    countReviewForCompanyAggregation
}