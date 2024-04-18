import { Request, Response } from 'express';
import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

import { User, UserDocument } from '../models/user';
import isValidEmail from '../util/email-checker';
import unlockUser from '../util/unlock-user';

const MAX_LOGIN_ATTEMPTS = 3

// Signup endpoint
const register = async (req: Request, res: Response) => {
  try {
    // Extract user data from request body
    const { email, password, name } = req.body;

    // Check if email is valid
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create new user
    const newUser: UserDocument = new User({
      email,
      password: hashedPassword,
      name,
    });

    // Save user to database
    await newUser.save();

    // Generate JWT token
    const token = sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY || 'secretKey', {
      expiresIn: '1w'
    });

    // Return token and user data
    res.status(201).json({ token, user: newUser });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Login endpoint
const login = async (req: Request, res: Response) => {
  try {
    // Extract user data from request body
    const { email, password } = req.body;

    // Check if email is valid
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Find user by email
    const user: UserDocument = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Unlock if user was locked 
    if (user.locked) {
      const response = await unlockUser(user)
      return res.status(response.status).json({ message: response.message })
    }

    if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      user.locked = true;
      user.lockedAt = new Date();
      await user.save();
      return res.status(403).json({ message: 'Account locked due to multiple failed attempts' });
    }

    // Compare passwords
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      await User.updateOne({ email }, { $inc: { loginAttempts: 1 } });
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = sign({ userId: user._id }, process.env.JWT_SECRET_KEY || 'secretKey', {
      expiresIn: '1w'
    });

    // Return token and user data
    res.status(200).json({ token, user });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export {
  register,
  login
}