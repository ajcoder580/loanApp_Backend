const router = require("express").Router();
const authorizeRoles = require('../Middleware/AuthoriseRole');
const userModel = require('../Models/User');

// Get user profile
router.get('/profile', authorizeRoles(['user', 'admin']), async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.user.email }).select('-password');
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }
        
        res.json({ success: true, user });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// Only admin can access
router.get('/admin-dashboard', authorizeRoles('admin'), (req, res) => {
    res.json({ 
        success: true, 
        message: 'Welcome Admin!',
        user: req.user
    });
});

// Only regular users can access
router.get('/user-dashboard', authorizeRoles('user'), (req, res) => {
    res.json({ 
        success: true, 
        message: 'Welcome User!',
        user: req.user
    });
});

module.exports = router;