// backend/controllers/authController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || '123456789'; // Use env var for security

// Register user (admin can add users)
exports.register = async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body;

    // Validate required fields
    if (!fullname || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields (fullname, email, password, role) are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // DO NOT hash password here, let the model pre-save hook handle it
    const user = new User({ fullname, email, password, role });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login user and generate JWT token
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Debug log
    console.log("Login attempt:", { email, password });

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Prepare payload with user info for JWT token
    const payload = { id: user._id, role: user.role, fullname: user.fullname };

    // Sign JWT token valid for 8 hours
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

    res.json({ token, user: payload });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
