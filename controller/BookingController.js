const asyncHandler = require("express-async-handler");
const { validationCreateBooking,
    Booking,
    validationUpdateBooking
} = require("../model/Booking");
const { CarRent } = require("../model/CarRent");
const { GetPromo } = require("../model/GetPromo");
const { Promo } = require("../model/Prome");
const bookingCompanyAggregation = require("../aggregation/bookingAggregation");



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
                promoCode: req.body.promoCode,
                mainCarPrice: req.body.mainCarPrice,
                discountPercent: req.body.discountPercent,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                isDelivered: false
            });

            if(req.body.promoCode) {
                const promo = await Promo.findOne({ promoCode : req.body.promoCode });
                if (!promo) {
                    return res.status(404).send({ message: 'Promotion not found' });
                }
            
                const getPromo = await GetPromo.findOne({ userId: req.user.id, promoId: promo._id });
                if (!getPromo) {
                    return res.status(400).json({ message: "You have not claimed this promotion" });
                }
            
                if (getPromo.isUsed) {
                    return res.status(400).json({ message: "Promotion has already been userd" });
                }
            
                if (req.params.currentTime < getPromo.startDate || req.params.currentTime > getPromo.endDate) {
                    return res.status(400).json({ message: "Promotion is expired" });
                }
            
                getPromo.isUsed = true;
                await getPromo.save();
            
                promo.usedCount += 1;
                await promo.save();
            }

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
            promoCode: req.body.promoCode,
            mainCarPrice: req.body.mainCarPrice,
            discountPercent: req.body.discountPercent,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            isDelivered: req.body.isDelivered
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
            populate: [
                { path: "CarImage" },
                { path: "CarMake" }
            ],
        })
        .lean() // Convert to plain JavaScript objects for easier manipulation
        .sort({ createdAt: -1 });

    // Convert CarMake array to an object (assuming there's only one item)
    bookings.forEach(booking => {
        if (booking.car && booking.car.length > 0) {
            const car = booking.car[0];
            if (car.CarMake && car.CarMake.length > 0) {
                car.CarMake = car.CarMake[0]; // Set CarMake to the first object in the array
            }
        }
    });

    res.status(200).json(bookings);
});


/**
 * @desc Get company booking
 * @Route /api/booking/company
 * @method GET
 * @access private (only employee)
*/
module.exports.getBookingCompanyController = asyncHandler(async(req,res)=>{
    const companyId = req.params.id;
    const bookingCompany = await Booking.aggregate([
        ...bookingCompanyAggregation(companyId)
    ]);
    res.status(200).json(bookingCompany);
});



/**
 * @desc Get all bookings
 * @Route /api/booking
 * @method GET
 * @access private (only employee)
*/
module.exports.getAllBookingController = asyncHandler(async (req, res) => {
    const DEFAULT_BOOKING_CAR_PER_PAGE = 3;
    const { pageNumber, limitPage } = req.query;
    const bookingPerPage = limitPage ? parseInt(limitPage) : DEFAULT_BOOKING_CAR_PER_PAGE;

    let allBookings;

    if (pageNumber) {
        allBookings = await Booking.find().populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "car",
            populate: { path: "CarImage" }
        }).sort({ createdAt: -1 }).skip((pageNumber - 1) * bookingPerPage)
            .limit(bookingPerPage);
    } else {
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
