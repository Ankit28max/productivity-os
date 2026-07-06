require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to ProductivityOS API Gateway Server',
    status: 'online',
    version: '1.0.0',
  });
});

// Database connection logic
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/productivityos';

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('MongoDB successfully connected to database server.');
  })
  .catch((err) => {
    console.error('MongoDB database connection error:', err);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`ProductivityOS backend server listening on port ${PORT}...`);
});
