

const companyAggregation = [
        {
            $lookup: {
                from: "carrents", 
                localField: "_id",
                foreignField: "companyId",
                as: "cars"
            }
        },
        {
            $addFields: {
                carCount: { $size: "$cars" }
            }
        },
        {
            $lookup: {
                from: "companyimages",
                localField: "_id",
                foreignField: "companyID",
                as: "images"
            }
        },
        {
            $addFields: {
                imageCompany: {
                    $arrayElemAt: [
                        {
                            $filter: {
                                input: "$images",
                                as: "image",
                                cond: { $eq: ["$$image.isDefaultImage", true] }
                            }
                        },
                        0
                    ] 
                }
            }
        },
        {
            $project: {
                cars: 0, 
                images: 0 
            }
        },
];


module.exports = companyAggregation;

