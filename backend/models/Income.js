const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    amount: { type: Number, required: true },
    completedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Income', IncomeSchema);
