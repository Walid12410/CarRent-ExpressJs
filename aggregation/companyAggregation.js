

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
                as: "imageCompany"
            }
        },
        {
            $project: {
                cars: 0, 
            }
        },
];


module.exports = companyAggregation;

