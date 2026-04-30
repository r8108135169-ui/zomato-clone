// routes/restaurants.js
const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

/**
 * GET /api/restaurants
 * Query params: city, category, isVegOnly, minRating, maxDeliveryFee, sortBy, search, page, limit
 */
router.get('/', async (req, res, next) => {
  try {
    const {
      city,
      category,
      isVegOnly,
      minRating,
      maxDeliveryFee,
      sortBy = 'rating',
      search,
      page = 1,
      limit = 12,
    } = req.query;

    const filter = { isActive: true };

    // Filters
    if (city) filter['address.city'] = { $regex: city, $options: 'i' };
    if (category) filter.category = { $regex: category, $options: 'i' };
    if (isVegOnly === 'true') filter.isVegOnly = true;
    if (minRating) filter.rating = { $gte: parseFloat(minRating) };
    if (maxDeliveryFee !== undefined) filter.deliveryFee = { $lte: parseInt(maxDeliveryFee) };

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Sort options
    const sortMap = {
      rating: { rating: -1 },
      deliveryTime: { deliveryTime: 1 },
      deliveryFee: { deliveryFee: 1 },
      priceAsc: { priceForTwo: 1 },
      priceDesc: { priceForTwo: -1 },
    };
    const sort = sortMap[sortBy] || { rating: -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [restaurants, total] = await Promise.all([
      Restaurant.find(filter).sort(sort).skip(skip).limit(parseInt(limit)).lean(),
      Restaurant.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: restaurants,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit),
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/restaurants/:id
 */
router.get('/:id', async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).lean();
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }
    res.json({ success: true, data: restaurant });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
