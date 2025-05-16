const router = require("express").Router();
const authorizeRoles = require('../Middleware/AuthoriseRole');
const loanValidation = require('../Middleware/loanValidationMiddleware');
const { 
    createLoan, 
    getLoansByUser,
    getAllLoans,
    updateLoanStatus,
    getAdminStats,
    getRecentUsers,
    getLoanById,
    deleteLoan
} = require('../Controllers/loanformController');
const { authenticateToken } = require('../Middleware/authMiddleware');

// Create a new loan application - only users can access
router.post('/', 
    authenticateToken,
    authorizeRoles('user'),
    ...loanValidation,
    createLoan
);

// Get all loans for the current user
router.get('/my-loans',
    authenticateToken,
    getLoansByUser
);

// Admin Routes

// Get all loan applications (admin only)
router.get('/admin/all-loans',
    authenticateToken,
    authorizeRoles('admin'),
    getAllLoans
);

// Update loan status (admin only)
router.put('/admin/update-status',
    authenticateToken,
    authorizeRoles('admin'),
    updateLoanStatus
);

// Get admin dashboard statistics (admin only)
router.get('/admin/stats',
    authenticateToken,
    authorizeRoles('admin'),
    getAdminStats
);

// Get recent users for admin dashboard (admin only)
router.get('/admin/recent-users',
    authenticateToken,
    authorizeRoles('admin'),
    getRecentUsers
);

// Get a single loan by ID (admin only)
router.get('/admin/loan/:loanId',
    authenticateToken,
    authorizeRoles('admin'),
    getLoanById
);

// Delete a loan application by ID (admin only)
router.delete('/admin/loan/:loanId',
    authenticateToken,
    authorizeRoles('admin'),
    deleteLoan
);

module.exports = router;