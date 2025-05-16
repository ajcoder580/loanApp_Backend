// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { signup, login, createAdmin } = require('../Controllers/authController');
const { signupValidation, loginValidation } = require('../Middleware/authMiddleware');
const authorizeRoles = require('../Middleware/AuthoriseRole');
const jwt = require('jsonwebtoken');

router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);

// Admin-only route to create another admin user
router.post('/create-admin', createAdmin);

// Profile endpoint to get current user data
router.get('/profile', async (req, res) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied: No token provided'
    });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    
    // Add user to request
    const User = require('../Models/User');
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Return user data
    return res.status(200).json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Profile endpoint error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
