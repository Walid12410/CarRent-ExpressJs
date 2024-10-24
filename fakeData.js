const express = require('express');
const router = express.Router();
const { faker } = require('@faker-js/faker');
const { User } = require('./model/User');
const { CarMake } = require('./model/CarMake');
const { Category } = require('./model/Category');


router.post('/fake', async (req, res) => {
    try {

        const users = [];

        for (let i = 0; i < 150; i++) {
            users.push({
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                email: faker.internet.email(),
                phoneNumber: faker.phone.number('##########').replace(/[^\d]/g, '') ,// Ensures only digits are included
                password: faker.internet.password(8, false), // Generates a password of at least 8 characters
                isAdmin: 0
            });
        }

        await User.insertMany(users);
    } catch (err) {
        console.error('Error inserting fake data:', err);
        res.status(500).json({ message: 'Error inserting fake data', error: err.message || err });
    }
});

// Route to generate fake car makes
router.post('/fake-car-makes', async (req, res) => {
    try {
        const carMakes = [];

        for (let i = 0; i < 150; i++) {
            carMakes.push({
                carMakeName: faker.vehicle.manufacturer() // Generate a fake car make name
            });
        }

        await CarMake.insertMany(carMakes);
        res.status(201).json({ message: 'Fake car makes inserted successfully', count: carMakes.length });
    } catch (err) {
        console.error('Error inserting fake car makes:', err);
        res.status(500).json({ message: 'Error inserting fake car makes', error: err.message || err });
    }
});


router.post('/fake-car-categories', async (req, res) => {
    try {
        const categories = [];

        for (let i = 0; i < 15; i++) {
            categories.push({
                categoryName: faker.vehicle.type() // Generate a fake car category name
            });
        }

        await Category.insertMany(categories);
        res.status(201).json({ message: 'Fake car categories inserted successfully', count: categories.length });
    } catch (err) {
        console.error('Error inserting fake car categories:', err);
        res.status(500).json({ message: 'Error inserting fake car categories', error: err.message || err });
    }
});



module.exports = router;
