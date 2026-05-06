// backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Ensure this matches the KEY you set in Render
    const conn = await mongoose.connect(process.env.MONGODB_URI); 
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};