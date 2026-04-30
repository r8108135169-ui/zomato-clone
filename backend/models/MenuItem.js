// models/MenuItem.js
const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    discountedPrice: { type: Number },
    category: { type: String, required: true }, // e.g. "Starters", "Main Course"
    image: { type: String, default: '' },
    isVeg: { type: Boolean, required: true, default: false },
    isAvailable: { type: Boolean, default: true },
    isPopular: { type: Boolean, default: false },
    isBestseller: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    tags: [{ type: String }],
    customizations: [
      {
        name: String,          // e.g. "Size"
        required: Boolean,
        options: [
          {
            label: String,     // e.g. "Large"
            extraPrice: Number,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

menuItemSchema.index({ restaurant: 1, category: 1 });
menuItemSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('MenuItem', menuItemSchema);
