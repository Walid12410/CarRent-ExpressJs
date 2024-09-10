const express = require("express");
const connectToDB = require("./config/connectToDB");
const { notFound, errorHandler } = require("./middlewares/error");
const cors = require("cors");
require("dotenv").config();


// Connection to database
connectToDB();

// Init app
const app = express();


app.use(express.json());


// Cors Policy
app.use(cors({
    origin: "http://localhost:3000"
}))


app.get("/",(req,res)=>{
    res.send("Welcome to Car Rent Market!");
});


// Routes
app.use("/api/auth",require("./routes/authRoute"));
app.use("/api/user",require("./routes/userRoute"));
app.use("/api/company",require("./routes/companyRoute"));
app.use("/api/auth-employee",require("./routes/authEmployeeRoute"));
app.use("/api/car-rent", require("./routes/CarRentRoute"));
app.use("/api/category", require("./routes/CategoryRoute"));
app.use("/api/promo", require("./routes/promoRoute"));
app.use("/api/review", require("./routes/reviewRoute"));
app.use("/api/offer", require("./routes/offerRoute"));


// Error Handler Middleware
app.use(notFound);
app.use(errorHandler);


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, "127.0.0.1", ()=>{
    console.log(`Server is running on port ${PORT}`);
});
