const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  deliveryOption: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  transactionId: { type: String, required: false }, // Optional for non-bKash payments
  orderSummary: [
    {
      productName: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  userId: { type: String, required: false }, // Link order to a user
  status: { type: String, default: 'Pending' }, // Pending, Confirmed, Cancelled, Completed
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);
