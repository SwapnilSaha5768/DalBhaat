const express = require('express');
const { createProduct, editProduct, deleteProduct, approveOrder, cancelOrder, makeUserAdmin } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// Apply auth and admin check to all administrative routes
router.use(authMiddleware, adminMiddleware);

router.post('/product', createProduct);
router.put('/product/:id', editProduct);
router.delete('/product/:id', deleteProduct);
router.put('/user/admin/:id', makeUserAdmin);

module.exports = router;