const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true }, // Discount amount in BDT
    expiresAt: { type: Date, required: true }, // Expiration date
    usageLimit: { type: Number, default: null }, // Maximum number of uses (optional)
    timesUsed: { type: Number, default: 0 }, // Track how many times the coupon has been used
    isActive: { type: Boolean, default: true }, // Toggle coupon status
  },
  { timestamps: true }
);

module.exports = mongoose.model('Coupon', couponSchema);
