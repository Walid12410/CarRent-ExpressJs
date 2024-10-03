 Car Rent Api

This is an Express.js-based API providing full car rental service functionality, including user registration, login, car rental, promo code management, and notification services. Admins can create companies and employees, and employees can manage cars and create rental offers.

## Features

- **User Management**: User authentication and authorization using JWT tokens.
- **Post Management**: Create, read, update, and delete posts.
- **Toggle Like**: Like and unlike posts.
- **Token Verification**: Secure access to protected routes with JWT.
- **Image Upload**: Upload and manage images with Cloudinary.
- **Middleware**: Custom middleware for various functionalities including validation and error handling.
- **Validation**: Validation for ObjectId to ensure valid MongoDB document IDs.
- **Error Handling**: Centralized error handling for consistent API responses.
- **Private Access**: Ensure certain API endpoints are accessible only to authenticated users using token verification.

## Technologies Used

- **Express.js**: Web framework for Node.js.
- **MongoDB**: NoSQL database for data storage.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js.
- **JWT (JsonWebToken)**: For authentication and authorization.
- **Cloudinary**: Cloud-based image and video management services.
- **Bcrypt**: Library to hash user passwords.
- **Express-Async-Handler**: Simple middleware for handling exceptions inside of async express routes.
- **Firebase**: firebase to send notification
- **More-Library**: dotenv,joi,multer etc...

## Setup and Installation

### Clone the repository:

```sh
git clone https://github.com/Walid12410/CarRent-ExpressJs
cd CarRent-ExpressJs
```

### Install dependencies:

```sh
npm install
```

### Set up environment variables:

Create a `.env` file in the root directory and add the following variables:

```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Start the server:

```sh
npm start
```

## API Endpoints

### Auth Routes:

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Authenticate a user and return a token.

### User Routes:

- `GET /api/users/profile`: Get all Users. (Private)
- `GET /api/users/profile/:id`: Get user and post by ID. (Private)
- `PUT /api/users/profile/:id`: Update a User Profile by ID. (Private)
- `DELETE /api/users/profile/:id`: Delete a User by ID. (Private)
- `GET /api/users/count`: Count Users. (Private)
- `POST /api/users/profile/profile-photo-upload`: Upload Image. (Private)

### Post Routes:

- `GET /api/posts`: Get all posts. (Public)
- `POST /api/posts`: Create a new post. (Private)
- `GET /api/posts/:id`: Get a single post by ID. (Public)
- `PUT /api/posts/:id`: Update a post by ID. (Private)
- `DELETE /api/posts/:id`: Delete a post by ID. (Private)
- `GET /api/post/count`: Count Posts. (Public)
- `PUT /api/posts/update-image`: Upload Image. (Private)

### Like Routes:

- `PUT /api/posts/like/:id`: Toggle like on a post. (Private)

### Comments Routes:

- `//`.

## Middleware

- **Auth Middleware**: Protect routes by verifying JWT tokens.
- **Error Handler**: Centralized error handling for API responses.
- **ObjectId Validator**: Validate MongoDB ObjectId for routes with parameters.

## Private Access

To ensure private access to certain API endpoints, the Auth Middleware verifies the JWT token before granting access. This middleware is applied to routes that require authentication.

### Example of Private Access Middleware

```javascript
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
};

module.exports = { protect };
```

Apply the `protect` middleware to routes:

```javascript
const { protect } = require('./middleware/authMiddleware');

app.use('/api/users/profile', protect);
app.use('/api/posts', protect);
```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements, bug fixes, or new features.

## License

This `README.md` file includes all the necessary information, formatted properly for easy reading and understanding.
