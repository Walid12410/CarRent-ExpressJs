const getFeatureAggregation = (useCurrentTime) => [
    {
        $match: {
            startDate : { $lte : useCurrentTime },
            endDate : { $gte: useCurrentTime }
        }
    },
    {
        $lookup : {
            from : 'carrents',
            localField : 'carId',
            foreignField : '_id',
            as: 'car'
        }
    },
    {
        $unwind : {path : '$car', preserveNullAndEmptyArrays: true}
    },
    {
        $match : {
            'car.carStatus' : 'available'
        }
    },
    {
        $lookup : {
            from: 'reviews',
            localField : 'car._id',
            foreignField: 'carId',
            as: 'carReviews'
        }
    },
    {
        $lookup : {
            from : 'carimages',
            localField : 'car._id',
            foreignField : 'carRentID',
            as : 'CarImage'
        }
    },
    {
        $addFields : {
            'car.reviewCount' : { $size : '$carReviews'},
            'car.averageRating' : {
                $cond : {
                    if: { $gt: [{ $size: '$carReviews' }, 0 ]},
                    then : { $avg: '$carReviews.rate'},
                    else: null
                }
            },
            'car.CarImage' : '$CarImage'
        }
    },
    {
        $project : {
            'carReviews': 0, // Optionally exclude fields you don't want to return
            'CarImage': 0,
        }
    }
];

module.exports = { getFeatureAggregation };