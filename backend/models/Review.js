// models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true },
    body: { type: String, trim: true },
    images: [String],
    isVerifiedPurchase: { type: Boolean, default: false },
    helpfulVotes: { type: Number, default: 0 },
    // Sub-ratings
    foodRating: { type: Number, min: 1, max: 5 },
    deliveryRating: { type: Number, min: 1, max: 5 },
    packagingRating: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true }
);

// One review per user per order
reviewSchema.index({ user: 1, order: 1 }, { unique: true });
reviewSchema.index({ restaurant: 1, rating: -1 });

// Auto-update restaurant rating on save
reviewSchema.post('save', async function () {
  const Restaurant = mongoose.model('Restaurant');
  const stats = await mongoose.model('Review').aggregate([
    { $match: { restaurant: this.restaurant } },
    { $group: { _id: '$restaurant', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  if (stats.length > 0) {
    await Restaurant.findByIdAndUpdate(this.restaurant, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count,
    });
  }
});

module.exports = mongoose.model('Review', reviewSchema);
