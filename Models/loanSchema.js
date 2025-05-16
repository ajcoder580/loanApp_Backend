const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Simplified address schema to match frontend submission
const addressSchema = new Schema({
    addressLine1: {
        type: String,
        required: true,
        trim: true
    },
    addressLine2: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    postalCode: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        default: "India",
        trim: true
    }
}, { _id: false });

const employmentSchema = new Schema({
    // Simplified employment schema matching frontend data
    employerName: {
        type: String,
        required: true,
        trim: true
    },
    position: {
        type: String,
        required: true,
        trim: true
    },
    yearsAtCurrentEmployer: {
        type: Number,
        min: 0,
        default: 0
    },
    employmentStatus: {
        type: String,
        enum: ["Permanent", "Contract", "Probation", "Part-time"],
        default: "Permanent"
    },
    // Employer address simplified
    employerAddress: {
        country: {
            type: String,
            default: "India"
        }
    },
    // Industry information
    sector: {
        type: String,
        enum: [
            "Agriculture", "Automotive", "Banking", "Construction", "Education", 
            "Energy", "Entertainment", "Finance", "Government", "Healthcare", 
            "Hospitality", "Information Technology", "Insurance", "Manufacturing", 
            "Media", "Retail", "Telecommunications", "Transportation", "Other"
        ],
        default: "Information Technology"
    },
    // Compensation details simplified
    monthlySalary: {
        type: Number,
        min: 0,
        default: 0
    },
    bonuses: {
        type: Number,
        default: 0
    },
    otherCompensation: {
        type: Number,
        default: 0
    }
}, { _id: false });

const loanApplicationSchema = new Schema({
    // Basic Loan Information
    userId: {
        type: String,
        required: true,
        index: true
    },
    loanId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    
    // Application Status
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Under Review', 'Additional Info Required', 'Conditionally Approved', 'Approved', 'Rejected', 'Disbursed', 'Closed'],
        default: 'Pending'
    },
    applicationDate: {
        type: Date,
        default: Date.now,
        required: true,
        index: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    statusHistory: [{
        status: {
            type: String,
            enum: ['Pending', 'Under Review', 'Additional Info Required', 'Conditionally Approved', 'Approved', 'Rejected', 'Disbursed', 'Closed']
        },
        date: {
            type: Date,
            default: Date.now
        },
        notes: {
            type: String,
            trim: true
        },
        updatedBy: {
            type: String
        }
    }],
    
    // Loan Details
    loanAmount: {
        type: Number,
        required: true,
        min: 1000,
        max: 10000000
    },
    loanTerm: {
        type: Number,
        required: true,
        min: 6,
        max: 600,
        description: 'Loan term in months'
    },
    purpose: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 500
    },
    loanType: {
        type: String,
        required: true,
        enum: ["Personal Loan", "Home Loan", "Education Loan", "Vehicle Loan", "Business Loan", "Gold Loan", "Loan Against Property"]
    },
    interestRate: {
        type: Number,
        required: true,
        min: 6,
        max: 30
    },
    emi: {
        type: Number,
        min: 0
    },
    processingFee: {
        type: Number,
        min: 0,
        default: 0
    },
    
    // Financial Information
    monthlyIncome: {
        type: Number,
        required: true,
        min: 10000,
        max: 10000000
    },
    annualIncome: {
        type: Number,
        required: true,
        min: 120000,
        max: 120000000
    },
    otherIncome: {
        type: Number,
        default: 0
    },
    totalMonthlyExpenses: {
        type: Number,
        min: 0
    },
    existingLoans: {
        type: String,
        enum: ["Yes", "No"],
        default: "No"
    },
    existingEMI: {
        type: Number,
        default: 0
    },
    creditScore: {
        type: Number,
        required: true,
        min: 300,
        max: 900
    },
    creditHistory: {
        bankruptcies: {
            type: Number,
            default: 0
        },
        defaults: {
            type: Number,
            default: 0
        },
        latePayments: {
            type: Number,
            default: 0
        }
    },
    
    // Applicant Information (All text-based fields)
    applicantDetails: {
        // Personal Information
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        middleName: {
            type: String,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        dateOfBirth: {
            type: Date,
            required: true
        },
        placeOfBirth: {
            type: String,
            trim: true
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
            required: true
        },
        maritalStatus: {
            type: String,
            enum: ["Single", "Married", "Divorced", "Widowed"],
            required: true
        },
        spouseName: {
            type: String,
            trim: true
        },
        mothersMaidenName: {
            type: String,
            trim: true
        },
        fathersName: {
            type: String,
            trim: true
        },
        nationality: {
            type: String,
            default: "Indian",
            trim: true
        },
        
        // Family details
        dependents: {
            type: Number,
            min: 0,
            default: 0
        },
        children: {
            type: Number,
            min: 0,
            default: 0
        },
        familyMembers: {
            type: Number,
            min: 1,
            default: 1
        },
        
        // Educational background
        education: {
            type: String,
            enum: ["High School", "Diploma", "Bachelor's", "Master's", "Doctorate", "Other"],
            required: true
        },
        highestDegree: {
            type: String,
            trim: true
        },
        institutionName: {
            type: String,
            trim: true
        },
        graduationYear: {
            type: Number,
            min: 1950,
            max: 2050
        },
        specialization: {
            type: String,
            trim: true
        },
        
        // Contact Information
        phone: {
            type: String,
            required: true,
            trim: true
        },
        alternatePhone: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        preferredContactMethod: {
            type: String,
            enum: ["Phone", "Email", "SMS", "WhatsApp"],
            default: "Phone"
        },
        contactTime: {
            type: String,
            enum: ["Morning", "Afternoon", "Evening", "Anytime"],
            default: "Anytime"
        },
        
        // Social profiles
        socialMedia: {
            linkedin: String,
            facebook: String,
            twitter: String
        },
        
        // Reference Contacts
        emergencyContact: {
            name: String,
            relationship: String,
            phone: String,
            email: String
        },
        
        // Tax Information
        pan: {
            type: String,
            trim: true
        },
        taxResidencyStatus: {
            type: String,
            enum: ["Resident", "Non-Resident", "Foreign National"],
            default: "Resident"
        },
        taxFilingStatus: {
            type: String,
            enum: ["Regular", "Defaulter", "First Time", "Not Applicable"],
            default: "Regular"
        }
    },
    
    // Employment Details
    employmentType: {
        type: String,
        required: true,
        enum: ["Salaried", "Self-employed", "Business", "Government", "Retired", "Student"]
    },
    employmentDetails: employmentSchema,
    // Residence Information (All text-based fields)
    residentialStatus: {
        type: String,
        required: true,
        enum: ["Owned", "Rented", "Parent's Property", "Company Provided", "Relative's Property", "Mortgaged"]
    },
    residentialAddress: {
        addressLine1: {
            type: String,
            required: true,
            trim: true
        },
        addressLine2: {
            type: String,
            trim: true
        },
        city: {
            type: String,
            required: true,
            trim: true
        },
        district: {
            type: String,
            trim: true
        },
        state: {
            type: String,
            required: true,
            trim: true
        },
        postalCode: {
            type: String,
            required: true,
            trim: true
        },
        country: {
            type: String,
            default: "India",
            trim: true
        },
        landmark: {
            type: String,
            trim: true
        },
        addressType: {
            type: String,
            enum: ["Residential", "Permanent", "Office", "Temporary"],
            default: "Residential"
        },
        isBillingAddress: {
            type: Boolean,
            default: true
        },
        isMailingAddress: {
            type: Boolean,
            default: true
        }
    },
    yearsAtCurrentAddress: {
        type: Number,
        min: 0,
        required: true
    },
    monthsAtCurrentAddress: {
        type: Number,
        min: 0,
        max: 11,
        default: 0
    },
    ownershipDocuments: {
        propertyTaxReceipt: String,
        electricityBillNumber: String,
        waterBillNumber: String,
        gasConnectionNumber: String,
        internetProviderAccountNumber: String,
        propertyInsuranceDetails: String
    },
    housingLoanDetails: {
        existingLoan: {
            type: Boolean,
            default: false
        },
        loanProviderName: String,
        loanAmount: Number,
        remainingLoanAmount: Number,
        loanAccountNumber: String,
        monthlyEMI: Number,
        loanStartDate: Date,
        loanEndDate: Date
    },
    rentalDetails: {
        monthlyRent: Number,
        leaseStartDate: Date,
        leaseEndDate: Date,
        landlordName: String,
        landlordContact: String,
        securityDepositAmount: Number,
        rentAgreementReference: String
    },
    previousAddresses: [{
        addressLine1: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
        stayPeriodFrom: Date,
        stayPeriodTo: Date,
        residentialStatus: String
    }],
    
    // Loan Purpose Details
    loanPurpose: {
        type: String,
        required: true,
        enum: [
            "Personal Expenses",
            "Home Improvement",
            "Education",
            "Medical Expenses",
            "Wedding",
            "Vacation",
            "Business",
            "Debt Consolidation",
            "Vehicle Purchase",
            "Property Purchase",
            "Home Construction",
            "Education Expenses",
            "Other"
        ]
    },
    purposeDetails: {
        type: String,
        maxlength: 1000
    },
    
    // Financial Assessment
    repaymentCapacity: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    debtToIncomeRatio: {
        type: Number,
        min: 0,
        max: 100
    },
    loanTenure: {
        type: Number,
        required: true,
        min: 6,
        max: 600
    },
    
    // Banking Information (All text-based, no document uploads)
    bankDetails: {
        accountNumber: {
            type: String,
            trim: true,
            required: true
        },
        accountType: {
            type: String,
            enum: ["Savings", "Current", "Salary", "Fixed Deposit"],
            required: true
        },
        bankName: {
            type: String,
            trim: true,
            required: true
        },
        ifscCode: {
            type: String,
            trim: true,
            required: true
        },
        accountHolderName: {
            type: String,
            trim: true,
            required: true
        },
        branchName: {
            type: String,
            trim: true
        },
        micr: {
            type: String,
            trim: true
        },
        accountOpeningDate: Date,
        transactionHistory: {
            averageMonthlyBalance: Number,
            monthlyDeposits: Number,
            monthlyWithdrawals: Number,
            recurringDeposits: Boolean,
            salaryCredits: Boolean
        },
        internetBankingEnabled: {
            type: Boolean,
            default: false
        },
        nomineeDetails: {
            name: String,
            relationship: String,
            contactNumber: String
        }
    },
    
    // References
    references: [{
        name: {
            type: String,
            trim: true
        },
        relationship: {
            type: String,
            enum: ["Family", "Friend", "Colleague", "Neighbor", "Other"]
        },
        contactNumber: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            trim: true
        },
        address: String
    }],
    
    // Co-applicant Information
    coApplicant: {
        type: Boolean,
        default: false
    },
    coApplicantDetails: {
        fullName: String,
        dateOfBirth: Date,
        relationship: {
            type: String,
            enum: ["Spouse", "Parent", "Child", "Sibling", "Friend", "Other"]
        },
        monthlyIncome: Number,
        occupation: String,
        contactInfo: {
            phone: String,
            email: String
        },
        address: addressSchema
    },
    
    // Identity and Document Information (Text-based)
    identityInformation: {
        // Simplified identity information
        idType: {
            type: String,
            enum: ["Aadhar Card", "PAN Card", "Voter ID", "Passport", "Driving License"],
            required: true
        },
        idNumber: {
            type: String,
            required: true,
            trim: true
        },
        otherBankAccounts: {
            type: Array,
            default: []
        }
    },
    
    // Processing Information
    processingInfo: {
        assignedTo: String,
        internalNotes: [{
            note: String,
            addedBy: String,
            addedOn: {
                type: Date,
                default: Date.now
            }
        }],
        verificationCalls: [{
            callDate: Date,
            calledBy: String,
            contactedPerson: String,
            relationship: String,
            notes: String,
            status: {
                type: String,
                enum: ["Successful", "Failed", "No Response"]
            }
        }],
        riskAssessment: {
            riskScore: {
                type: Number,
                min: 0,
                max: 100
            },
            riskCategory: {
                type: String,
                enum: ["Low", "Medium", "High"]
            },
            assessmentNotes: String,
            assessedBy: String,
            assessedOn: Date
        }
    }
});

const LoanModel = mongoose.model("LoanApplication", loanApplicationSchema);
module.exports = LoanModel;