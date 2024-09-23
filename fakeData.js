const express = require('express');
const router = express.Router();
const { faker } = require('@faker-js/faker');
const { User } = require('./model/User');



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


module.exports = router;
