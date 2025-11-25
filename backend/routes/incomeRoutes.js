const express = require('express');
const Income = require('../models/Income');
const router = express.Router();

// Get total income from all completed orders
router.get('/total', async (req, res) => {
    try {
        const result = await Income.aggregate([
            {
                $group: {
                    _id: null,
                    totalIncome: { $sum: '$amount' }
                }
            }
        ]);

        const totalIncome = result.length > 0 ? result[0].totalIncome : 0;
        res.status(200).json({ totalIncome });
    } catch (error) {
        console.error('Error fetching total income:', error);
        res.status(500).json({ error: 'Failed to fetch total income' });
    }
});

module.exports = router;
