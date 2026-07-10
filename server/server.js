require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/habits', require('./routes/habits'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/steps', require('./routes/steps'));

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
  .connect(mongoURI, { dbName: 'productivityos' })
  .then(() => {
    console.log('MongoDB successfully connected to database server.');
  })
  .catch((err) => {
    console.error('MongoDB database connection error:', err);
  });

// Serve static assets in production — only for non-API routes
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  // Only serve index.html for non-API GET requests
  app.get(/^(?!\/api).*$/, (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
  });
}

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`ProductivityOS backend server listening on port ${PORT}...`);
  });
}

module.exports = app;
