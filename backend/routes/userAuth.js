const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    // Extract the authorization header
    const authHeader = req.headers['authorization'];

    // Split the 'Bearer' and token, and get the token part
    const token = authHeader && authHeader.split(" ")[1];

    // Check if token is provided
    if (token == null) {
        return res.status(401).json({ message: "Authentication token required" });
    }

    // Verify the token
    jwt.verify(token, "bookStore123", (err, user) => {
        if (err) {
            console.error("JWT verification error: ", err.message);
            return res.status(403).json({ message: "Invalid or expired token" });
        }
        req.user = user;
        next();
    });
};

module.exports = { authenticateToken };
