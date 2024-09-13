
const carRentAggregation = [
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
        $addFields:{
            reviewCount: { $size: { $ifNull: ['$reviews', []] } }, // Provide default empty array
            averageRating: { $avg: { $ifNull: ['$reviews.rate', []] } }, // Provide default empty array
            firstCarImage: {
                $cond: {
                    if: { $gt: [{ $size: { $ifNull: ['$CarImage', []] } }, 0] }, // Check if CarImage array has elements
                    then: [{ $arrayElemAt: [{ $ifNull: ['$CarImage', []] }, 0] }], // Get the first image
                    else: [] // If no images, set to empty array
                }
            }
        }
    },
    {
        $project: {
            reviews: 0,
            CarImage :0 
        },
    }

];


module.exports = carRentAggregation;