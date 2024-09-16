
const carRentAggregation = [
    {
        $match: {
            carStatus: "Available" 
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
            createdAt: -1 // Sort by createdAt to get the latest cars
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


module.exports = carRentAggregation;