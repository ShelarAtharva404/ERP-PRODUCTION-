const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT Secret from env
const JWT_SECRET = process.env.JWT_SECRET || 'yoursecretkey';

// Middleware to verify JWT token and authenticate user
const verifyToken = async (req, res, next) => {
  try {
    // Get token from header: Authorization: Bearer token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach user info to request
    req.user = {
      id: decoded.id,
      role: decoded.role,
      fullname: decoded.fullname
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Token is not valid or expired' });
  }
};

// Middleware to authorize based on user role(s)
// Pass one or more roles that are allowed
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource' });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  authorizeRoles
};
