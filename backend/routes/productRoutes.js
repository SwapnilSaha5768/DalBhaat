const express = require('express');
const router = express.Router();
const { getProducts } = require('../controllers/productController');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public routes
router.get('/', getProducts);
router.get('/stock', async (req, res) => {
  try {
    const { name } = req.query;
    const product = await Product.findOne({ name });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ quantity: product.quantity });
  } catch (error) {
    console.error('Error fetching product quantity:', error);
    res.status(500).json({ error: 'Failed to fetch product quantity' });
  }
});

// Authenticated customer routes
router.post('/reduce-quantity', authMiddleware, async (req, res) => {
  try {
    const { orderItems } = req.body;
    if (!orderItems || !Array.isArray(orderItems)) {
      return res.status(400).json({ error: 'Invalid order items.' });
    }

    for (let item of orderItems) {
      const product = await Product.findOne({ name: item.productName });
      if (!product) {
        return res.status(404).json({ error: `Product ${item.productName} not found.` });
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${item.productName}.` });
      }
      product.quantity -= item.quantity;
      await product.save();
    }
    res.status(200).json({ message: 'Stock updated successfully.' });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ error: 'Failed to update stock.' });
  }
});

// Admin-only management routes
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  const { name, price, quantity, description, image, category } = req.body;
  try {
    const newProduct = new Product({ name, price, quantity, description, image, category });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error adding product:', error.message);
    res.status(500).json({ message: 'Failed to add product' });
  }
});

router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error.message);
    res.status(500).json({ message: 'Failed to update product' });
  }
});

router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error.message);
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

module.exports = router;
