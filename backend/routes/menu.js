// routes/menu.js
const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

/**
 * GET /api/menu/:restaurantId
 * Returns menu items grouped by category
 */
router.get('/:restaurantId', async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const { isVeg, category } = req.query;

    const filter = { restaurant: restaurantId, isAvailable: true };
    if (isVeg === 'true') filter.isVeg = true;
    if (category) filter.category = { $regex: category, $options: 'i' };

    const items = await MenuItem.find(filter).lean();

    // Group items by category for easy frontend rendering
    const grouped = items.reduce((acc, item) => {
      const cat = item.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {});

    // Build ordered array of category groups
    const categories = Object.keys(grouped).map((cat) => ({
      category: cat,
      items: grouped[cat],
    }));

    res.json({
      success: true,
      data: {
        categories,
        total: items.length,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/menu/item/:itemId
 * Single menu item detail
 */
router.get('/item/:itemId', async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.itemId)
      .populate('restaurant', 'name image rating')
      .lean();
    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
