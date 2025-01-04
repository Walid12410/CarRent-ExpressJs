const { ObjectId } = require("mongodb");

const reviewCompanyAggregation = (companyId) => [
    {
        $lookup: {
            from: "carrents",
            localField: "reviews.carId",
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
        }
    },
    {
        $unwind: {
            path : "$user",
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $sort: {
            createdAt: -1
        }
    },
    {
        $match: {
            "car.companyId": new ObjectId(companyId)
        }
    }
];


module.exports = {
    reviewCompanyAggregation
}