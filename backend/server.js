// server.js - FooDash API Entry Point
require('dotenv').config();
const connectDB = require('./config/db');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');

const app = express();
// Add this line below to fix the ReferenceError
const PORT = process.env.PORT || 5000; 

// Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
// ... (rest of your existing middleware and routes)
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: '🍔 FooDash API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/auth', authRoutes); // <== Add this here

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ... existing app.listen code
app.listen(PORT, () => {
  console.log(`\n🚀 FooDash API running on http://localhost:${PORT}`);
  console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});
