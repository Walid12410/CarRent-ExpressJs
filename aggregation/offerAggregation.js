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
        $match : {
            'car.carStatus' : 'available'
        }
    },
    {
        $lookup: {
            from: 'carMakes',
            localField: 'car.carMakeId',
            foreignField: '_id',
            as: 'carMake'
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
            'car.CarImage': '$CarImage' // Add carImages to car object
        }
    },
    {
        $project: {
            'carReviews': 0, // Optionally exclude fields you don't want to return
            'CarImage': 0,
        }
    }
];

module.exports = { getActiveOffersAggregation };
