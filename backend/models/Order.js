// models/Order.js
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  name: String,       // snapshot at time of order
  price: Number,      // snapshot at time of order
  quantity: { type: Number, required: true, min: 1 },
  customizations: [
    {
      name: String,
      selectedOption: String,
      extraPrice: Number,
    },
  ],
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    items: [orderItemSchema],

    // Pricing breakdown
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    taxes: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },

    // Delivery details
    deliveryAddress: {
      line1: String,
      city: String,
      pincode: String,
      lat: Number,
      lng: Number,
    },

    // Order lifecycle
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'pending',
    },
    statusHistory: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
        note: String,
      },
    ],

    // Payment
    paymentMethod: { type: String, enum: ['cod', 'card', 'upi', 'wallet'], default: 'cod' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    paymentId: String,

    estimatedDeliveryTime: String,
    notes: String,
  },
  { timestamps: true }
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ restaurant: 1, status: 1 });

module.exports = mongoose.model('Order', orderSchema);
