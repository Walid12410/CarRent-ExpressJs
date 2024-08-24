const mongoose = require("mongoose");

module.exports = async() =>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected To Mangodb");
    } catch (error) {
        console.log("Connection Failed to MangoDB!" , error)
    }
}