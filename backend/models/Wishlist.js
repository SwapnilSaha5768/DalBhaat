const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
});

// Ensure a user can only have one entry per product
WishlistSchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', WishlistSchema);
