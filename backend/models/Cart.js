const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  items: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true, default: 1 },
      image: { type: String },
    },
  ],
});

module.exports = mongoose.model('Cart', CartSchema);
