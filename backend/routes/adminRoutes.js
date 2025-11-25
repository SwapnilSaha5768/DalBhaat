const express = require('express');
const { createProduct, editProduct, deleteProduct, approveOrder, cancelOrder, makeUserAdmin } = require('../controllers/adminController');
const router = express.Router();

router.post('/product', createProduct);
router.put('/product/:id', editProduct);
router.delete('/product/:id', deleteProduct);

router.put('/user/admin/:id', makeUserAdmin);

module.exports = router;