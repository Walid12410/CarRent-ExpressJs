const express = require("express");
const connectToDB = require("./config/connectToDB");
require("dotenv").config();


// Connection to database
connectToDB();

// Init app
const app = express();


app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Welcome to Car Market!!");
});

// Routes
app.use("/api/auth",require("./routes/authRoute"));
app.use("/api/user",require("./routes/userRoute"));
app.use("/api/company",require("./routes/companyRoute"));
app.use("/api/auth-employee",require("./routes/authEmployeeRoute"));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});

 