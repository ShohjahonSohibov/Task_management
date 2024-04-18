"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateToken = (req, res, next) => {
    // Get token from authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    // Verify token and check expiration
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY || 'secretKey', (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired' });
            }
            return res.status(401).json({ message: 'Invalid token' }); // Generic error for other verification errors
        }
        req.user = decoded;
        // Token is valid and not expired, continue to next middleware
        next();
    });
};
exports.default = validateToken;
//# sourceMappingURL=validate-token.js.map