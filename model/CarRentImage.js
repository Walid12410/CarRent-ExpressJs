const  mongoose = require("mongoose");


// Car Image Schema 
const CarImageSchema = new mongoose.Schema({
    carRentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CarRent",
        required: true
    },
    carImage: {
        url: {
            type: String,
            required: true
        },
        cloudinary_id: {
            type: String,
            required: true
        }
    },
},{ timestamps : true });


const CarImage = mongoose.model("CarImage",CarImageSchema);

module.exports = CarImage;