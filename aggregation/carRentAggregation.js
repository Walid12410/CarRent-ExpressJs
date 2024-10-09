
const carRentAggregation = [
    {
        $match: {
            carStatus: "available" 
        }
    },
    {
        $lookup:{
            from : "reviews",
            localField :"_id",
            foreignField :"carId",
            as :"reviews"
        }
    },
    {
        $lookup:{
            from :"carimages",
            localField : "_id",
            foreignField : "carRentID",
            as :"CarImage"
        }
    },
    {
        $sort: {
            createdAt: -1 
        }
    },
    {
        $addFields:{
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
        $lookup:{
            from : "reviews",
            localField :"_id",
            foreignField :"carId",
            as :"reviews"
        }
    },
    {
        $lookup:{
            from :"carimages",
            localField : "_id",
            foreignField : "carRentID",
            as :"CarImage"
        }
    },
    {
        $sort: {
            createdAt: -1 
        }
    },
    {
        $addFields:{
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
    carRentTopRatedAggregation
};