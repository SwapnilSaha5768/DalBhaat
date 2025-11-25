const express = require('express');
const Cart = require('../models/Cart');
const router = express.Router();


router.get('/cart', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId is required' });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.json({ success: true, items: [] });
    }
    res.json({ success: true, items: cart.items });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch cart' });
  }
});


router.put('/cart', async (req, res) => {
  try {
    const { userId, name, price, image, quantity } = req.body;
    if (!userId || !name || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Invalid data' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity = quantity;
    } else {
      cart.items.push({ name, price, image, quantity });
    }

    // Save the updated cart
    await cart.save();
    res.json({ success: true, cart });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ success: false, message: 'Failed to update cart' });
  }
});


router.delete('/cart/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId is required' });
    }

    // Find the user's cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    // Remove the item by name
    cart.items = cart.items.filter(item => item.name !== name);

    // Save the updated cart
    await cart.save();
    res.json({ success: true, message: 'Item removed', cart });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ success: false, message: 'Failed to remove item' });
  }
});


router.delete('/cart', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId is required' });
    }

    // Find and delete the user's cart
    await Cart.deleteOne({ userId });
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ success: false, message: 'Failed to clear cart' });
  }
});

module.exports = router;
