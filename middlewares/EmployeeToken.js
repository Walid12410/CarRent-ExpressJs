const jwt = require("jsonwebtoken");

// Token Verification For Employee
function verifyEmployeeToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_EMPLOYEE);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ message: "Inavlid token, access denied" });
        }
    } else {
        return res.status(401).json({ message: "no token provided, access denied" });
    }
}

module.exports = verifyEmployeeToken;
