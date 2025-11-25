const Coupon = require('../models/Coupon');

// Function to reduce coupon usage
const reduceCouponUsage = async (req, res) => {
  const { couponCode } = req.body;

  try {
    // Find the coupon by code
    const coupon = await Coupon.findOne({ code: couponCode });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found.' });
    }

    // Check if the coupon is active
    if (!coupon.isActive) {
      return res.status(400).json({ success: false, message: 'Coupon is not active.' });
    }

    // Check if the coupon has a usage limit and if it has been exceeded
    if (coupon.usageLimit !== null && coupon.timesUsed >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: 'Coupon usage limit exceeded.' });
    }

    // Increment timesUsed
    coupon.timesUsed += 1;

    // If there's a usage limit, decrement it
    if (coupon.usageLimit !== null) {
      coupon.usageLimit -= 1;
    }

    // Save the updated coupon
    await coupon.save();

    res.status(200).json({ success: true, message: 'Coupon usage reduced successfully.', coupon });
  } catch (error) {
    console.error('Error reducing coupon usage:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { reduceCouponUsage };
