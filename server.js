// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./Routes/AuthRouter');
const loanRoutes = require('./Routes/LoanRoutes');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for both local and production frontend
const allowedOrigins = [
  'http://localhost:5173', // Local Vite dev server
  'http://localhost:8080',
  'https://online-loan-application.vercel.app',
  'https://online-loan-application-frontend.vercel.app',
  'https://loan-app-frontend-silk.vercel.app'// Actual deployed frontend
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    res.header('Access-Control-Allow-Origin', '*'); // Fallback for development
  }
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    return res.status(200).json({});
  }
  next();
});

// Routes
// Root route handler
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Online Loan Application API is running' });
});

app.use('/auth', authRoutes);
app.use('/loans', loanRoutes);

// Error handler for bad JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Invalid JSON format' });
  }
  next();
});

// Connect DB and start server
mongoose.connect(process.env.MONGO_URI, {
   
}).then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error('Mongo error:', err));
