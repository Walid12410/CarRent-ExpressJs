const asyncHandler = require("express-async-handler");
const { validationCreateBooking,
    Booking,
    validationUpdateBooking
} = require("../model/Booking");
const { CarRent } = require("../model/CarRent");



/**
 * @desc Create new booking
 * @Route /api/booking/:id
 * @method POST
 * @access private (only user)
*/
module.exports.createBookingController = asyncHandler(async (req, res) => {
    const { error } = validationCreateBooking(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    let carFound = await CarRent.findOne({ _id: req.params.id });
    if (!carFound) {
        return res.status(404).json({ message: "Car not found" });
    } else {
        if (carFound.carStatus === "Available") {
            let createBook = new Booking({
                userId: req.user.id,
                carId: req.params.id,
                daysRent: req.body.daysRent,
                totalRentPrice: req.body.totalRentPrice,
                startDate: req.body.startDate,
                endDate: req.body.endDate
            });

            await createBook.save();
            carFound.carStatus = "Rented";
            await carFound.save();

            return res.status(201).json({ message: "Your booking has been added successfully" });
        } else {
            return res.status(409).json({ message: "Car is already rented" });
        }
    }
});


/**
 * @desc Update booking
 * @Route /api/booking/:id
 * @method PUT
 * @access private (only user or employee)
*/
module.exports.updateBookingController = asyncHandler(async (req, res) => {
    const { error } = validationUpdateBooking(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const updateBooking = await Booking.findByIdAndUpdate(req.params.id, {
        $set: {
            daysRent: req.body.daysRent,
            totalRentPrice: req.body.totalRentPrice,
            startDate: req.body.startDate,
            endDate: req.body.endDate
        }
    }, { new: true });

    if (!updateBooking) {
        return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(updateBooking);
});


/**
 * @desc Get user bookings
 * @Route /api/booking/:id
 * @method GET
 * @access private (only user or admin)
*/
module.exports.getBookingUserController = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ userId: req.params.id })
        .populate({
            path: "car",
            populate: { path: "CarImage" }
        }).populate("CarImage").sort({ createdAt: -1 });

    if (!bookings || bookings.length === 0) {
        return res.status(404).json({ message: "No bookings found for this user" });
    }
    res.status(200).json(bookings);
});


/**
 * @desc Get all bookings
 * @Route /api/booking
 * @method GET
 * @access private (only employee)
*/
module.exports.getAllBookingController = asyncHandler(async (req, res) => {
    const DEFAULT_BOOKING_CAR_PER_PAGE = 3;
    const { pageNumber , limitPage} = req.query;
    const bookingPerPage = limitPage ? parseInt(limitPage) : DEFAULT_BOOKING_CAR_PER_PAGE;

    let allBookings;

    if(pageNumber){
        allBookings = await Booking.find().populate({
            path: "user",
            select : "-password"
        }).populate({
            path: "car",
            populate : { path: "CarImage"}
        }).sort({ createdAt : -1 }).skip( (pageNumber -1 ) * bookingPerPage)
        .limit(bookingPerPage);
    }else{
        allBookings = await Booking.find();
    }

    res.status(200).json(allBookings);
});


/**
 * @desc Delete booking
 * @Route /api/booking/:id
 * @method DELETE
 * @access private (only user, admin, employee)
*/
module.exports.deleteBookingController = asyncHandler(async (req, res) => {
    const bookingFound = await Booking.findById(req.params.id);
    if (!bookingFound) {
        return res.status(404).json({ message: "Booking not found" });
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Booking has been deleted successfully" });
});
