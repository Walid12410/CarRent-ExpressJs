Car Rental API
This is an Express.js-based API that provides a full-featured car rental service, including user registration, login, car rental functionality, promo code management, and notification services. It also supports an admin system where admins can create companies and employees. Employees can manage cars and create offers.

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
User Registration and Login: Users can create an account and log in.
Car Rental: Users can browse and rent cars.
Promo Codes: Users can apply promo codes for discounts.
Notifications: Users can receive notifications regarding their bookings or offers.
Admin Panel:
Create companies and employees.
Employee Panel:
Manage cars and create rental offers.
Technologies
Node.js
Express.js
MongoDB (or any preferred database)
JWT (JSON Web Token) for authentication
Firebase for notifications (optional)
Cloudinary for image management (optional)
Prerequisites
Before running this project, ensure you have:

Node.js installed (v14 or higher)
MongoDB installed locally or available via a service like MongoDB Atlas
Firebase (for notifications) and Cloudinary accounts (for image hosting) if those features are being used
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
Create a .env file in the root directory and add the necessary environment variables:

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
This project uses MongoDB for storing data.

Set up a MongoDB instance either locally or on MongoDB Atlas.
Update the MONGODB_URI in the .env file to point to your MongoDB instance.
The API will automatically create the necessary collections when it is run for the first time.
API Endpoints
Authentication
POST /api/register
Register a new user.

Request body:
json
Copy code
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
POST /api/login
Login a user and receive a JWT token.

Request body:
json
Copy code
{
  "email": "john@example.com",
  "password": "123456"
}
User Operations
POST /api/rent-car
Rent a car.

Request body:
json
Copy code
{
  "carId": "abc123",
  "rentDays": 3
}
Requires Authorization Header: Bearer <JWT_TOKEN>
GET /api/promo/

Get details of a specific promo code.

GET /api/notifications
Get user notifications.

Admin Operations
POST /api/admin/company
Create a new company.

Request body:
json
Copy code
{
  "companyName": "Rent-a-Car",
  "companyEmail": "info@rentacar.com",
  "companyAddress": "Downtown, City"
}
Requires Admin Authorization Header: Bearer <ADMIN_JWT_TOKEN>
POST /api/admin/employee
Create a new employee for a company.

Request body:
json
Copy code
{
  "companyId": "abc123",
  "employeeName": "Jane Doe",
  "employeeEmail": "jane@example.com"
}
Requires Admin Authorization Header: Bearer <ADMIN_JWT_TOKEN>
Employee Operations
POST /api/employee/car
Add a new car to the system.

Request body:
json
Copy code
{
  "carModel": "Toyota Camry",
  "carPrice": 50,
  "companyId": "abc123"
}
Requires Employee Authorization Header: Bearer <EMPLOYEE_JWT_TOKEN>
POST /api/employee/offer
Create an offer for a car.

Request body:
json
Copy code
{
  "carId": "abc123",
  "discountPercentage": 20
}
Requires Employee Authorization Header: Bearer <EMPLOYEE_JWT_TOKEN>
Authentication
This API uses JWT (JSON Web Tokens) for authentication. After logging in, include the JWT in the Authorization header for requests that require authentication.

Example:

bash
Copy code
Authorization: Bearer <JWT_TOKEN>
Notifications
Notifications are sent using Firebase Cloud Messaging (FCM). Users will receive notifications for various events like successful rentals, new offers, or promotional updates.

Contributing
We welcome contributions to this project! To contribute:

Fork the repository.
Create a new branch with your feature or bugfix.
Submit a pull request to the main repository.
License
This project is licensed under the MIT License.
