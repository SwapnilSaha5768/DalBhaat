const express = require('express');
const Coupon = require('../models/Coupon');
const { reduceCouponUsage } = require('../controllers/couponController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const router = express.Router();

// Validate Coupon
router.post('/validate', async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code, isActive: true });

    if (!coupon) {
      return res.status(400).json({ error: 'Invalid or inactive coupon code' });
    }

    if (new Date() > coupon.expiresAt) {
      return res.status(400).json({ error: 'Coupon has expired' });
    }

    if (coupon.usageLimit !== null && coupon.timesUsed >= coupon.usageLimit) {
      return res.status(400).json({ error: 'Coupon usage limit has been reached' });
    }

    res.status(200).json({ discount: coupon.discount });
  } catch (error) {
    console.error('Error validating coupon:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reduce coupon usage during checkout
router.post('/reduce-usage', authMiddleware, reduceCouponUsage);

// Admin-only coupon management
router.post('/create', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { code, discount, expiresAt, usageLimit } = req.body;
    if (!code || !discount || !expiresAt) {
      return res.status(400).json({ error: 'Code, discount, and expiry date are required' });
    }
    const newCoupon = new Coupon({ code, discount, expiresAt, usageLimit });
    await newCoupon.save();
    res.status(201).json({ message: 'Coupon created successfully', coupon: newCoupon });
  } catch (error) {
    console.error('Error creating coupon:', error);
    res.status(500).json({ error: 'Failed to create coupon' });
  }
});

router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json(coupons);
  } catch (error) {
    console.error('Error fetching coupons:', error);
    res.status(500).json({ error: 'Failed to fetch coupons' });
  }
});

router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCoupon = await Coupon.findByIdAndDelete(id);
    if (!deletedCoupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }
    res.status(200).json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    res.status(500).json({ error: 'Failed to delete coupon' });
  }
});

router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { code, discount, expiresAt, usageLimit } = req.body;
    if (!code || !discount || !expiresAt) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      { code, discount, expiresAt, usageLimit },
      { new: true }
    );
    if (!updatedCoupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.status(200).json(updatedCoupon);
  } catch (error) {
    console.error('Error updating coupon:', error.message);
    res.status(500).json({ message: 'Failed to update coupon', error: error.message });
  }
});

module.exports = router;
