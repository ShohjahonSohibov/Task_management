"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const user_1 = require("../models/user");
const email_checker_1 = __importDefault(require("../util/email-checker"));
const unlock_user_1 = __importDefault(require("../util/unlock-user"));
const MAX_LOGIN_ATTEMPTS = 3;
// Signup endpoint
const register = async (req, res) => {
    try {
        // Extract user data from request body
        const { email, password, name } = req.body;
        // Check if email is valid
        if (!(0, email_checker_1.default)(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        // Check if user already exists
        const existingUser = await user_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash password
        const hashedPassword = await (0, bcrypt_1.hash)(password, 10);
        // Create new user
        const newUser = new user_1.User({
            email,
            password: hashedPassword,
            name,
        });
        // Save user to database
        await newUser.save();
        // Generate JWT token
        const token = (0, jsonwebtoken_1.sign)({ userId: newUser._id }, process.env.JWT_SECRET_KEY || 'secretKey', {
            expiresIn: '1w'
        });
        // Return token and user data
        res.status(201).json({ token, user: newUser });
    }
    catch (error) {
        console.error('Error signing up:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.register = register;
// Login endpoint
const login = async (req, res) => {
    try {
        // Extract user data from request body
        const { email, password } = req.body;
        // Check if email is valid
        if (!(0, email_checker_1.default)(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        // Find user by email
        const user = await user_1.User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        // Unlock if user was locked 
        if (user.locked) {
            const response = await (0, unlock_user_1.default)(user);
            return res.status(response.status).json({ message: response.message });
        }
        if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
            user.locked = true;
            user.lockedAt = new Date();
            await user.save();
            return res.status(403).json({ message: 'Account locked due to multiple failed attempts' });
        }
        // Compare passwords
        const passwordMatch = await (0, bcrypt_1.compare)(password, user.password);
        if (!passwordMatch) {
            await user_1.User.updateOne({ email }, { $inc: { loginAttempts: 1 } });
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        // Generate JWT token
        const token = (0, jsonwebtoken_1.sign)({ userId: user._id }, process.env.JWT_SECRET_KEY || 'secretKey', {
            expiresIn: '1w'
        });
        // Return token and user data
        res.status(200).json({ token, user });
    }
    catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.login = login;
//# sourceMappingURL=auth.js.map