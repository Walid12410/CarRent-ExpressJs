const ObjectId = require('mongodb').ObjectId;


const getActiveOffersAggregation = (userCurrentTime) => [
    {
        $match: {
            startDate: { $lte: userCurrentTime },
            endDate: { $gte: userCurrentTime },
        }
    },
    {
        $sort: {
            createdAt: -1
        }
    },
    {
        $lookup: {
            from: 'carrents',
            localField: 'carId',
            foreignField: '_id',
            as: 'car'
        }
    },
    {
        $unwind: { path: '$car', preserveNullAndEmptyArrays: true }
    },
    {
        $match: {
            'car.carStatus': 'Available'
        }
    },
    {
        $lookup: {
            from: 'carmakes',
            localField: 'car.carMakeId',
            foreignField: '_id',
            as: 'CarMake'
        }
    },
    {
        $lookup: {
            from: 'reviews',
            localField: 'car._id',
            foreignField: 'carId',
            as: 'carReviews'
        }
    },
    {
        $lookup: {
            from: 'carimages',
            localField: 'car._id',
            foreignField: 'carRentID',
            as: 'CarImage'
        }
    },
    {
        $addFields: {
            'car.reviewCount': { $size: '$carReviews' },
            'car.averageRating': {
                $cond: {
                    if: { $gt: [{ $size: '$carReviews' }, 0] },
                    then: { $avg: '$carReviews.rate' },
                    else: null
                }
            },
            'car.CarImage': '$CarImage',
            "car.CarMake": { $arrayElemAt: ["$CarMake", 0] }
        }
    },
    {
        $project: {
            'carReviews': 0, // Optionally exclude fields you don't want to return
            'CarImage': 0,
            'CarMake': 0
        }
    }
];


const getCompanyOffers = (companyId) => [
    {
        $sort: {
            createdAt: -1
        }
    },
    {
        $lookup: {
            from: "carrents",
            localField: 'carId',
            foreignField: '_id',
            as: "car"
        }
    },
    {
        $unwind: { path: "$car", preserveNullAndEmptyArrays: true }
    },
    {
        $match: {
            'car.companyId': new ObjectId(companyId)
        }
    },
    {
        $lookup: {
            from: 'carimages',
            localField: 'car._id',
            foreignField: 'carRentID',
            as: 'CarImage'
        }
    },
    {
        $lookup: {
            from: 'carmakes',
            localField: 'car.carMakeId',
            foreignField: '_id',
            as: 'CarMake'
        }
    },
    {
        $lookup: {
            from: 'reviews',
            localField: 'car._id',
            foreignField: 'carId',
            as: 'carReviews'
        }
    },
    {
        $addFields: {
            'car.reviewCount': { $size: '$carReviews' },
            'car.averageRating': {
                $cond: {
                    if: { $gt: [{ $size: '$carReviews' }, 0] },
                    then: { $avg: '$carReviews.rate' },
                    else: null
                }
            },
            'car.CarImage': '$CarImage',
            "car.CarMake": { $arrayElemAt: ["$CarMake", 0] }
        }
    },
    {
        $project: {
            'carReviews': 0,
            'CarImage': 0,
            'CarMake': 0
        }
    },
];


const countCompanyOffer = (companyId) => [
    {
        $lookup: {
            from: "carrents",          // Join with the 'carrents' collection
            localField: "carId",       // Join on the carId from the offer
            foreignField: "_id",       // Match with _id from the 'carrents' collection
            as: "car"
        }
    },
    {
        $unwind: { 
            path: "$car", 
            preserveNullAndEmptyArrays: true // Keep the offer even if no car is found
        }
    },
    {
        $match: {
            "car.companyId": new ObjectId(companyId) // Filter by companyId in the car field
        }
    },
    {
        $group: {
            _id: "$car.companyId",    // Group by the companyId inside the 'car' field
            offerCount: { $sum: 1 }    // Count the number of offers for this companyId
        }
    },
    {
        $limit: 1 // Since you want only one record for a specific company
    },
    {
        $project: { 
            _id: 0,  // Hide the _id field
            offerCount: 1 // Show offerCount
        }
    }
];




const countAllCompanyOffer = [
    {
        $lookup: {
          from: "companies", // The collection where companies are stored
          localField: "car.companyId",
          foreignField: "_id",
          as: "companyDetails",
        },
      },
      {
        $unwind: "$companyDetails", // Flatten the companyDetails array
      },
      {
        $group: {
          _id: "$car.companyId", // Group by companyId
          companyName: { $first: "$companyDetails.name" }, // Replace "name" with the field for the company name
          offerCount: { $sum: 1 }, // Count offers for each company
        },
      },
      {
        $sort: { offerCount: -1 }, // Sort by offer count in descending order
      },

];


module.exports =
{
    getActiveOffersAggregation,
    getCompanyOffers,
    countCompanyOffer
};
