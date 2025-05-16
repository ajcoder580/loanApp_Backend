const { body, validationResult } = require('express-validator');

// Validation middleware
const loanValidation = [
    // Basic Loan Information Validation - simplified requirements
    body('loanAmount')
        .isNumeric()
        .withMessage('Loan amount must be a number')
        .custom(value => {
            const num = Number(value);
            if (num < 1000 || num > 10000000) {
                throw new Error('Loan amount must be between 1000 and 10000000');
            }
            return true;
        }),

    body('loanTerm')
        .isInt()
        .withMessage('Loan term must be an integer')
        .custom(value => {
            const num = Number(value);
            if (num < 6 || num > 600) {
                throw new Error('Loan term must be between 6 and 600 months');
            }
            return true;
        }),

    body('purpose')
        .isString()
        .withMessage('Purpose must be a string')
        .isLength({ min: 5, max: 500 }) // Reduced minimum length requirement
        .withMessage('Purpose must be between 5 and 500 characters'),

    body('loanType')
        .isString()
        .withMessage('Loan type must be a string')
        .isIn(['Personal Loan', 'Home Loan', 'Education Loan', 'Vehicle Loan', 'Business Loan', 'Gold Loan', 'Loan Against Property'])
        .withMessage('Invalid loan type'),

    // Financial Information Validation - simplified requirements
    body('monthlyIncome')
        .isNumeric()
        .withMessage('Monthly income must be a number')
        .custom(value => {
            const num = Number(value);
            if (num < 5000) { // Reduced minimum requirement
                throw new Error('Monthly income must be at least 5,000');
            }
            return true;
        }),

    body('annualIncome')
        .isNumeric()
        .withMessage('Annual income must be a number')
        .custom(value => {
            const num = Number(value);
            if (num < 60000) { // Reduced minimum requirement
                throw new Error('Annual income must be at least 60,000');
            }
            return true;
        }),

    body('creditScore')
        .isNumeric()
        .withMessage('Credit score must be a number')
        .custom(value => {
            const num = Number(value);
            if (num < 300 || num > 900) {
                throw new Error('Credit score must be between 300 and 900');
            }
            return true;
        }),

    // Employment Information Validation
    body('employmentType')
        .isString()
        .withMessage('Employment type must be a string')
        .isIn(['Salaried', 'Self-employed', 'Business', 'Government', 'Retired', 'Student'])
        .withMessage('Invalid employment type'),

    // Personal Information - simplified requirements
    body('applicantDetails.firstName')
        .notEmpty()
        .withMessage('First name is required')
        .isString()
        .withMessage('First name must be a string'),

    body('applicantDetails.lastName')
        .notEmpty()
        .withMessage('Last name is required')
        .isString()
        .withMessage('Last name must be a string'),

    body('applicantDetails.email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email must be valid'),

    body('applicantDetails.phone')
        .notEmpty()
        .withMessage('Phone number is required')
        .matches(/^[0-9]{10}$/)
        .withMessage('Phone number must be 10 digits'),

    // Bank Details Validation - simplified
    body('bankDetails.accountNumber')
        .notEmpty()
        .withMessage('Account number is required')
        .isString()
        .withMessage('Account number must be a string'),

    body('bankDetails.ifscCode')
        .notEmpty()
        .withMessage('IFSC code is required')
        .isString()
        .withMessage('IFSC code must be a string'),

    // Validation handler with detailed diagnostics
    (req, res, next) => {
        // Log primary fields to diagnose what's being received
        console.log('Validating loan form data:', {
            receivedFields: Object.keys(req.body),
            loanAmount: req.body.loanAmount,
            loanTerm: req.body.loanTerm,
            purpose: req.body.purpose,
            loanType: req.body.loanType,
            hasPersonalInfo: req.body.applicantDetails ? 'Yes' : 'No',
            hasBankDetails: req.body.bankDetails ? 'Yes' : 'No',
            hasEmploymentDetails: req.body.employmentDetails ? 'Yes' : 'No',
            hasResidentialAddress: req.body.residentialAddress ? 'Yes' : 'No'
        });
        
        // Log nested objects structure
        if (req.body.applicantDetails) {
            console.log('Applicant details fields:', Object.keys(req.body.applicantDetails));
        }
        if (req.body.bankDetails) {
            console.log('Bank details fields:', Object.keys(req.body.bankDetails));
        }
        if (req.body.employmentDetails) {
            console.log('Employment details fields:', Object.keys(req.body.employmentDetails));
        }
        if (req.body.residentialAddress) {
            console.log('Residential address fields:', Object.keys(req.body.residentialAddress));
        }
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error('Validation errors:', errors.array());
            return res.status(400).json({ 
                success: false,
                message: 'Validation failed',
                errors: errors.array(),
                receivedFields: Object.keys(req.body)
            });
        }
        next();
    }
];

module.exports = loanValidation;