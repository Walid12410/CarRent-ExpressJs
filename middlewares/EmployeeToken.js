const jwt = require("jsonwebtoken");

// Token Verification For Employee
function verifyEmployeeToken(req, res, next) {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Invalid authorization format." });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_EMPLOYEE);
        req.user = decoded;
        next();
    } catch (ex) {
        if (ex.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired." });
        }
        res.status(400).json({ message: "Invalid token." });
    }
}

module.exports = verifyEmployeeToken;
