const ObjectId = require('mongodb').ObjectId;


const carRentAggregation = [
    {
        $match: {
            carStatus: "available"
        }
    },
    {
        $lookup: {
            from: "reviews",
            localField: "_id",
            foreignField: "carId",
            as: "reviews"
        }
    },
    {
        $lookup: {
            from: "carimages",
            localField: "_id",
            foreignField: "carRentID",
            as: "CarImage"
        }
    },
    {
        $sort: {
            createdAt: -1
        }
    },
    {
        $addFields: {
            reviewCount: { $size: { $ifNull: ['$reviews', []] } }, // Provide default empty array
            averageRating: { $avg: { $ifNull: ['$reviews.rate', []] } }, // Provide default empty array
        }
    },
    {
        $project: {
            reviews: 0,
        },
    }
];

const getOneCarRentAggregation = (carId) => [
    {
        $match: {
            _id: new ObjectId(carId),
        }
    },
    {
        $lookup: {
            from: "reviews",
            localField: "_id",
            foreignField: "carId",
            as: "reviews"
        }
    },
    {
        // Lookup user details for each review
        $lookup: {
            from: "users",
            localField: "reviews.userId", // Assuming 'userId' is the field in the 'reviews' collection
            foreignField: "_id",
            as: "reviewUsers",
            pipeline: [
                { $project: { password: 0  } } // Exclude password field
            ],
        }
    },
    {
        // Merge user details into the reviews
        $addFields: {
            reviews: {
                $map: {
                    input: "$reviews",
                    as: "review",
                    in: {
                        $mergeObjects: [
                            "$$review", // Keep the original review fields
                            {
                                user: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: "$reviewUsers",
                                                as: "user",
                                                cond: { $eq: ["$$user._id", "$$review.userId"] }
                                            }
                                        },
                                        0
                                    ]
                                }
                            }
                        ]
                    }
                }
            }
        }
    },
    {
        $addFields: {
            reviews: {
                $slice: [
                    { $sortArray: { input: "$reviews", sortBy: { rate: -1 } } }, // Sort reviews by rate
                    2 // Limit to top 2 reviews
                ]
            }
        }
    },
    {
        $lookup: {
            from: "carimages",
            localField: "_id",
            foreignField: "carRentID",
            as: "CarImage"
        }
    },
    {
        $lookup: {
            from: "companies",
            localField: "companyId",
            foreignField: "_id",
            as: "companyDetails"
        }
    },
    {
        $unwind: {
            path: '$companyDetails',
            preserveNullAndEmptyArrays: true
        }
    },
    {
        // Lookup for images and embed them inside the companyDetails
        $lookup: {
            from: "companyimages",
            localField: "companyDetails._id",
            foreignField: "companyID",
            as: "companyDetails.imageCompany"
        }
    },
    {
        $addFields: {
            reviewCount: { $size: { $ifNull: ['$reviews', []] } },
            averageRating: { $avg: { $ifNull: ['$reviews.rate', []] } }
        }
    },
    {
        $project: {
            reviews: 1, // Show top 2 reviews with user details
            CarImage: 1,
            companyDetails: 1,
            reviewCount: 1,
            averageRating: 1,
            carMake: 1,
            carModel : 1,
            year: 1,
            color : 1 ,
            carType : 1,
            carStatus : 1 ,
            companyId : 1 ,
            licensePlate : 1,
            vin : 1,
            mileage : 1,
            fuelType : 1, 
            transmission : 1 ,
            rentPrice : 1 ,
            createdAt: 1,
            categoryId : 1 ,
            updatedAt: 1 ,
        }
    }
];



const carRentTopRatedAggregation = [
    {
        $match: {
            carStatus: "available"
        }
    },
    {
        $lookup: {
            from: "reviews",
            localField: "_id",
            foreignField: "carId",
            as: "reviews"
        }
    },
    {
        $lookup: {
            from: "carimages",
            localField: "_id",
            foreignField: "carRentID",
            as: "CarImage"
        }
    },
    {
        $addFields: {
            reviewCount: { $size: { $ifNull: ['$reviews', []] } }, // Provide default empty array
            averageRating: { $avg: { $ifNull: ['$reviews.rate', []] } } // Provide default empty array
        }
    },
    {
        $match: {
            reviewCount: { $gt: 0 } // Only include cars that have reviews
        }
    },
    {
        $sort: {
            averageRating: -1, // Sort by averageRating in descending order to get top-rated cars
            createdAt: -1 // Sort by creation date in descending order as a tie-breaker
        }
    },
    {
        $project: {
            CarImage: 1,           // Include CarImage
            reviewCount: 1,        // Include reviewCount
            averageRating: 1       // Include averageRating
        }
    },
    {
        $limit: 10 // Optional: limit the number of top-rated cars to 10, adjust as needed
    }
];


const carRentAdminAggregation = [
    {
        $lookup: {
            from: "reviews",
            localField: "_id",
            foreignField: "carId",
            as: "reviews"
        }
    },
    {
        $lookup: {
            from: "carimages",
            localField: "_id",
            foreignField: "carRentID",
            as: "CarImage"
        }
    },
    {
        $sort: {
            createdAt: -1
        }
    },
    {
        $addFields: {
            reviewCount: { $size: { $ifNull: ['$reviews', []] } }, // Provide default empty array
            averageRating: { $avg: { $ifNull: ['$reviews.rate', []] } }, // Provide default empty array
        }
    },
    {
        $project: {
            reviews: 0,
        },
    }
];


module.exports = {
    carRentAggregation,
    carRentAdminAggregation,
    carRentTopRatedAggregation,
    getOneCarRentAggregation
};