const LoanModel = require('../Models/loanSchema');
const { v4: uuidv4 } = require('uuid');
const User = require('../Models/User');

// Create new loan
const createLoan = async (req, res) => {
  try {
    console.log('Creating loan with user:', req.user);
    console.log('Request body:', req.body);
    
    // Log all received fields to help debug missing or incorrect fields
    console.log('Received form fields:', Object.keys(req.body));
    
    const loanData = req.body;
    
    // Check for required fields based on schema requirements
    const requiredFields = ['loanAmount', 'loanTerm', 'purpose', 'monthlyIncome', 'loanType', 'employmentType'];
    const missingFields = [];
    
    requiredFields.forEach(field => {
      if (!loanData[field]) {
        missingFields.push(field);
        console.error(`Missing required field: ${field}`);
      }
    });
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        missingFields: missingFields
      });
    }
    
    // Convert string userId to ObjectId if needed
    const userId = req.user.id;
    console.log('User ID from token:', userId);
    
    // Document uploading functionality has been removed
    
    // Create the loan document
    const loan = new LoanModel({
      ...loanData,
      userId: userId,
      loanId: uuidv4(),
      status: 'Pending',
      applicationDate: new Date()
    });
    
    console.log('Loan object before saving:', loan);

    const savedLoan = await loan.save();
    console.log('Loan saved successfully:', savedLoan);
    
    res.status(201).json({
      success: true,
      message: 'Loan application submitted successfully',
      loanId: savedLoan.loanId
    });
  } catch (error) {
    console.error('Error saving loan:', error);
    
    // Handle mongoose validation errors more specifically
    if (error.name === 'ValidationError') {
      console.error('Validation errors:', error.errors);
      
      // Extract validation error messages
      const validationErrors = {};
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        validationErrors
      });
    } else if (error.code === 11000) {
      // Handle duplicate key errors
      return res.status(400).json({
        success: false,
        message: 'Duplicate loan application',
        error: 'A loan with this ID already exists'
      });
    }
    
    // For all other errors
    res.status(500).json({
      success: false,
      message: 'Error submitting loan application',
      error: error.message
    });
  }
};

// Get loans by user ID
const getLoansByUser = async (req, res) => {
  try {
    // The user ID is coming from the authenticated user in the request
    const userId = req.user.id;
    
    // Find all loans for this user
    const loans = await LoanModel.find({ userId: userId })
      .sort({ applicationDate: -1 }); // Sort by newest first
    
    res.status(200).json({
      success: true,
      count: loans.length,
      data: loans
    });
  } catch (error) {
    console.error('Error fetching loans:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving loan applications',
      error: error.message
    });
  }
};

// Get all loans - Admin function
const getAllLoans = async (req, res) => {
  try {
    // Find all loans, oldest first
    const loans = await LoanModel.find()
      .sort({ applicationDate: -1 }); // Sort by newest first
    
    // Get detailed user information for each loan
    const loansWithUserDetails = await Promise.all(loans.map(async (loan) => {
      const user = await User.findOne({ _id: loan.userId });
      return {
        ...loan._doc,
        userName: user ? user.name : 'Unknown User',
        userEmail: user ? user.email : 'Unknown Email'
      };
    }));
    
    res.status(200).json({
      success: true,
      count: loans.length,
      data: loansWithUserDetails
    });
  } catch (error) {
    console.error('Error fetching all loans:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving all loan applications',
      error: error.message
    });
  }
};

// Update loan status - Admin function
const updateLoanStatus = async (req, res) => {
  try {
    const { loanId, status } = req.body;
    
    if (!loanId || !status) {
      return res.status(400).json({
        success: false,
        message: 'Loan ID and status are required'
      });
    }
    
    // Validate status value
    const validStatuses = ['Pending', 'Approved', 'Rejected', 'Under Review'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value. Must be one of: ' + validStatuses.join(', ')
      });
    }
    
    // Find and update the loan
    const updatedLoan = await LoanModel.findOneAndUpdate(
      { loanId: loanId },
      { status: status },
      { new: true } // Return the updated document
    );
    
    if (!updatedLoan) {
      return res.status(404).json({
        success: false,
        message: 'Loan application not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Loan status updated successfully',
      data: updatedLoan
    });
    
  } catch (error) {
    console.error('Error updating loan status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating loan status',
      error: error.message
    });
  }
};

// Get user statistics - Admin function
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalLoans = await LoanModel.countDocuments();
    const pendingLoans = await LoanModel.countDocuments({ status: 'Pending' });
    
    // Calculate total amount of all loans
    const loans = await LoanModel.find();
    const totalAmount = loans.reduce((sum, loan) => sum + loan.loanAmount, 0);
    
    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalLoans,
        pendingApprovals: pendingLoans,
        totalAmount: totalAmount.toLocaleString('en-US', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        })
      }
    });
    
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving admin statistics',
      error: error.message
    });
  }
};

// Get recent users - Admin function
const getRecentUsers = async (req, res) => {
  try {
    // Get the most recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10);
      
    // For each user, count their loans
    const usersWithLoanCount = await Promise.all(recentUsers.map(async (user) => {
      const loanCount = await LoanModel.countDocuments({ userId: user._id.toString() });
      return {
        id: user._id,
        name: user.name,
        email: user.email,
        joined: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : 'Unknown',
        loanCount
      };
    }));
    
    res.status(200).json({
      success: true,
      data: usersWithLoanCount
    });
    
  } catch (error) {
    console.error('Error fetching recent users:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving recent users',
      error: error.message
    });
  }
};

// Get a single loan by ID - Admin function
const getLoanById = async (req, res) => {
  try {
    const { loanId } = req.params;
    
    if (!loanId) {
      return res.status(400).json({
        success: false,
        message: 'Loan ID is required'
      });
    }
    
    // Find the loan by loanId
    const loan = await LoanModel.findOne({ loanId });
    
    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan application not found'
      });
    }
    
    // Get user details
    const user = await User.findOne({ _id: loan.userId });
    
    // Create a detailed response
    const detailedLoan = {
      ...loan._doc,
      userName: user ? user.name : 'Unknown User',
      userEmail: user ? user.email : 'Unknown Email'
    };
    
    res.status(200).json({
      success: true,
      data: detailedLoan
    });
    
  } catch (error) {
    console.error('Error fetching loan details:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving loan details',
      error: error.message
    });
  }
};
// Delete a loan by ID - Admin function
const deleteLoan = async (req, res) => {
  try {
    const { loanId } = req.params;
    
    if (!loanId) {
      return res.status(400).json({
        success: false,
        message: 'Loan ID is required'
      });
    }
    
    // Find and delete the loan by loanId
    const deletedLoan = await LoanModel.findOneAndDelete({ loanId });
    
    if (!deletedLoan) {
      return res.status(404).json({
        success: false,
        message: 'Loan application not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Loan application deleted successfully',
      data: { loanId }
    });
    
  } catch (error) {
    console.error('Error deleting loan application:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting loan application',
      error: error.message
    });
  }
};


module.exports = {
  createLoan,
  getLoansByUser,
  getAllLoans,
  updateLoanStatus,
  getAdminStats,
  getRecentUsers,
  getLoanById,
  deleteLoan
};