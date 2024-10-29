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
            'car.carStatus' : 'Available'
        }
    },
    {
        $lookup: {
            from: "carmakes",
            localField: "car.carMakeId",
            foreignField: "_id",
            as: "CarMake"
        }
    },
    {
        $unwind: {
            path: "$CarMake",
            preserveNullAndEmptyArrays: true
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
            'car.CarImage' : '$CarImage',
            'car.CarMake' : '$CarMake'
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