const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
  try {
    // Check if Authorization header exists
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        message: "Authorization token is missing" 
      });
    }

    // Extract token (assuming "Bearer TOKEN" format)
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        message: "No token provided" 
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Find the user to double-check role
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ 
        message: "User not found" 
      });
    }

    // Check if user is an admin
    if (user.role !== 'admin') {
      return res.status(403).json({ 
        message: "Access denied. Admin rights required" 
      });
    }

    // Attach user information to the request object
    req.user = user;

    // Proceed to the next middleware or route handler
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: "Invalid token" 
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: "Token expired" 
      });
    }

    console.error('Admin middleware error:', error);
    res.status(500).json({ 
      message: "Internal server error", 
      error: error.message 
    });
  }
};

module.exports = authMiddleware;