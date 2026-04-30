// models/Restaurant.js
const mongoose = require('mongoose');

const operatingHoursSchema = new mongoose.Schema({
  day: { type: String, enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  open: String,   // e.g. "09:00"
  close: String,  // e.g. "23:00"
  isClosed: { type: Boolean, default: false },
});

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    description: { type: String, default: '' },
    cuisine: [{ type: String }],
    category: { type: String, required: true },
    address: {
      line1: { type: String, required: true },
      city: { type: String, required: true },
      pincode: String,
      lat: Number,
      lng: Number,
    },
    image: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    deliveryTime: { type: String, default: '30-40 min' },
    deliveryFee: { type: Number, default: 30 },
    minOrder: { type: Number, default: 100 },
    priceForTwo: { type: Number, default: 400 },
    isVegOnly: { type: Boolean, default: false },
    isOpen: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    tags: [{ type: String }],
    operatingHours: [operatingHoursSchema],
  },
  { timestamps: true }
);

// Index for text search
restaurantSchema.index({ name: 'text', cuisine: 'text', category: 'text' });
// Index for geospatial queries (if lat/lng added)
restaurantSchema.index({ 'address.city': 1, isOpen: 1, rating: -1 });

module.exports = mongoose.model('Restaurant', restaurantSchema);
