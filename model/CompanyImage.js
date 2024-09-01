const mongoose = require("mongoose");


// CompanyImage Schema
const CompanyImageSchema = new mongoose.Schema({
    companyID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Companies",
        required: true
    },
    image: {
        url: {
            type: String,
            required: true
        },
        cloudinary_id: {
            type: String,
            required: true
        }
    },
    isDefaultImage : {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const CompanyImage = mongoose.model("CompanyImage", CompanyImageSchema);


module.exports = {
    CompanyImage,
};
