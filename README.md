Car Rental API
This is an Express.js-based API providing full car rental service functionality, including user registration, login, car rental, promo code management, and notification services. Admins can create companies and employees, and employees can manage cars and create rental offers.

Table of Contents
Features
Technologies
Prerequisites
Installation
Database Setup
API Endpoints
Authentication
Notifications
Admin Operations
Employee Operations
User Operations
Contributing
License
Features
User Registration and Login: Create an account and log in to rent cars.
Car Rental: Users can browse available cars and rent them.
Promo Codes: Users can apply promo codes for discounts.
Notifications: Receive notifications for bookings or offers.
Admin Panel: Create companies and employees.
Employee Panel: Manage cars and create rental offers.
Technologies
Node.js
Express.js
MongoDB
JWT for authentication
Firebase for notifications (optional)
Cloudinary for image management (optional)
Prerequisites
Before running this project, ensure you have:

Node.js (v14 or higher)
MongoDB installed locally or accessible via a service like MongoDB Atlas
Firebase (for notifications) and Cloudinary accounts if those features are used
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/yourusername/car-rental-api.git
cd car-rental-api
Install the dependencies:

bash
Copy code
npm install
Create a .env file in the root directory with the following variables:

bash
Copy code
PORT=3000
MONGODB_URI=mongodb://localhost:27017/car-rental
JWT_SECRET=your_jwt_secret
CLOUDINARY_URL=cloudinary://your_cloudinary_key
FIREBASE_KEY_PATH=path_to_firebase_key_file
Start the server:

bash
Copy code
npm start
Database Setup
This project uses MongoDB for data storage.

Set up a MongoDB instance locally or using a service like MongoDB Atlas.
Update the MONGODB_URI in the .env file with your MongoDB connection string.
The necessary collections will be created automatically on the first run.
API Endpoints
Authentication
POST /api/register
Register a new user.

json
Copy code
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
POST /api/login
Login a user and receive a JWT token.

json
Copy code
{
  "email": "john@example.com",
  "password": "123456"
}
User Operations
POST /api/rent-car
Rent a car.

json
Copy code
{
  "carId": "abc123",
  "rentDays": 3
}
Requires Authorization: Bearer <JWT_TOKEN>
GET /api/promo/

Retrieve details for a specific promo code.

GET /api/notifications
Get user notifications.

Admin Operations
POST /api/admin/company
Create a new company.

json
Copy code
{
  "companyName": "Rent-a-Car",
  "companyEmail": "info@rentacar.com",
  "companyAddress": "Downtown, City"
}
Requires Admin Authorization: Authorization: Bearer <ADMIN_JWT_TOKEN>
POST /api/admin/employee
Create a new employee for a company.

json
Copy code
{
  "companyId": "abc123",
  "employeeName": "Jane Doe",
  "employeeEmail": "jane@example.com"
}
Requires Admin Authorization: Authorization: Bearer <ADMIN_JWT_TOKEN>
Employee Operations
POST /api/employee/car
Add a new car to the system.

json
Copy code
{
  "carModel": "Toyota Camry",
  "carPrice": 50,
  "companyId": "abc123"
}
Requires Employee Authorization: Authorization: Bearer <EMPLOYEE_JWT_TOKEN>
POST /api/employee/offer
Create an offer for a car.

json
Copy code
{
  "carId": "abc123",
  "discountPercentage": 20
}
Requires Employee Authorization: Authorization: Bearer <EMPLOYEE_JWT_TOKEN>
Authentication
This API uses JWT for authentication. After logging in, include the JWT in the Authorization header for all requests requiring authentication.

Example:

bash
Copy code
Authorization: Bearer <JWT_TOKEN>
Notifications
Notifications are sent using Firebase Cloud Messaging (FCM). Users receive notifications for various events like rentals, offers, and promotions.

Contributing
Contributions are welcome! To contribute:

Fork the repository.
Create a new branch for your feature or bugfix.
Submit a pull request.
License
This project is licensed under the MIT License.
