const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');

router.post('/', async (req, res) => {
  try {
    const { userId, name } = req.body;

    if (!userId || !name) {
      return res.status(400).json({ error: 'User ID and Product name are required' });
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

router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

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

router.delete('/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const { userId } = req.body; // Expect userId in body for delete, or query? Usually delete body is tricky. Let's try query or body. 
    // Standard axios delete accepts data in config.

    if (!name || !userId) {
      return res.status(400).json({ error: 'Product name and User ID are required' });
    }

    await Wishlist.deleteOne({ userId, name });

    res.status(200).json({ message: `Wishlist item '${name}' deleted successfully.` });
  } catch (error) {
    console.error('Error deleting wishlist item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
