// routes/orders.js
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// Validation rules for placing an order
const orderValidation = [
  body('userId').notEmpty().withMessage('userId is required'),
  body('restaurantId').notEmpty().withMessage('restaurantId is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.menuItemId').notEmpty().withMessage('menuItemId is required for each item'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('deliveryAddress.line1').notEmpty().withMessage('Delivery address is required'),
  body('paymentMethod')
    .isIn(['cod', 'card', 'upi', 'wallet'])
    .withMessage('Invalid payment method'),
];

/**
 * POST /api/orders
 * Place a new order
 */
router.post('/', orderValidation, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { userId, restaurantId, items, deliveryAddress, paymentMethod, notes } = req.body;

    // Fetch menu items to validate prices server-side
    const menuItemIds = items.map((i) => i.menuItemId);
    const menuItems = await MenuItem.find({ _id: { $in: menuItemIds } }).lean();

    const menuMap = {};
    menuItems.forEach((m) => (menuMap[m._id.toString()] = m));

    // Build order items with price snapshots
    let subtotal = 0;
    const orderItems = items.map((item) => {
      const menuItem = menuMap[item.menuItemId];
      if (!menuItem) throw new Error(`Menu item ${item.menuItemId} not found`);
      const itemTotal = menuItem.price * item.quantity;
      subtotal += itemTotal;
      return {
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
      };
    });

    // Fetch delivery fee from restaurant (simplified: use a fixed value here)
    const deliveryFee = 30;
    const taxRate = 0.05; // 5% GST
    const taxes = Math.round(subtotal * taxRate);
    const total = subtotal + deliveryFee + taxes;

    const order = await Order.create({
      user: userId,
      restaurant: restaurantId,
      items: orderItems,
      subtotal,
      deliveryFee,
      taxes,
      total,
      deliveryAddress,
      paymentMethod,
      notes,
      status: 'confirmed',
      statusHistory: [{ status: 'confirmed', note: 'Order placed successfully' }],
      estimatedDeliveryTime: '30-40 min',
    });

    const populated = await order.populate('restaurant', 'name image deliveryTime');

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: populated,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/orders/:userId
 * Get order history for a user
 */
router.get('/:userId', async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate('restaurant', 'name image')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/orders/:orderId/status
 * Update order status (for restaurant/admin use)
 */
router.patch('/:orderId/status', async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ['confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      {
        status,
        $push: { statusHistory: { status, note } },
      },
      { new: true }
    );

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
