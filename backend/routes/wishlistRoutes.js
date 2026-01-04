const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Product name is required' });
    }

    // Check if item already exists for this user
    const existingItem = await Wishlist.findOne({ userId, name });

    if (existingItem) {
      return res.status(200).json({ message: 'Product already in wishlist' });
    }

    await Wishlist.create({ userId, name });

    res.status(200).json({ message: 'Wishlist updated successfully' });
  } catch (error) {
    console.error('Error updating wishlist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's wishlist
    const userWishlist = await Wishlist.find({ userId });

    // Get counts for all items in user's wishlist
    const wishlistWithCounts = await Promise.all(userWishlist.map(async (item) => {
      const count = await Wishlist.countDocuments({ name: item.name });
      return {
        ...item.toObject(),
        clickCount: count
      };
    }));

    res.status(200).json(wishlistWithCounts);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:name', authMiddleware, async (req, res) => {
  try {
    const { name } = req.params;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ error: 'Product name is required' });
    }

    await Wishlist.deleteOne({ userId, name });

    res.status(200).json({ message: `Wishlist item '${name}' deleted successfully.` });
  } catch (error) {
    console.error('Error deleting wishlist item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
