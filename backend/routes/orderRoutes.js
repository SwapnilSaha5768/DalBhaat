const express = require('express');
const Order = require('../models/Order');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const router = express.Router();

// Create a new order
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { name, phone, address, deliveryOption, paymentMethod, transactionId, orderSummary, totalAmount } = req.body;
    const userId = req.user.id;

    if (!name || !phone || !address || !deliveryOption || !paymentMethod || !orderSummary || !totalAmount) {
      return res.status(400).json({ error: 'All required fields must be provided.' });
    }

    const newOrder = new Order({
      name,
      phone,
      address,
      deliveryOption,
      paymentMethod,
      transactionId: paymentMethod === 'bkash' ? transactionId : null,
      orderSummary,
      totalAmount,
      userId,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully!', orderId: savedOrder._id });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get orders for the authenticated user
router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Failed to fetch user orders' });
  }
});

// Get orders by User ID (Owner or Admin)
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const userId = req.params.userId;
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Failed to fetch user orders' });
  }
});

// Get all orders (Admin only)
router.get('/all', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order status (Admin only)
router.put('/:orderId/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.orderId;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Edit order details (Admin only)
router.put('/:orderId/edit', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const updatedOrder = req.body;

    const order = await Order.findByIdAndUpdate(orderId, updatedOrder, { new: true });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({ message: 'Order updated successfully', order });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Delete order (Admin only)
router.delete('/:orderId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({ message: 'Order cancelled and deleted successfully', orderId });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

// Get single order details (Owner or Admin)
router.get('/:orderId', authMiddleware, async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.userId && order.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Cancel order and restore stock (Owner or Admin)
router.post('/cancel/:orderId', authMiddleware, async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.userId && order.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Restore stock for each product in the order
    const Product = require('../models/Product');
    for (const item of order.orderSummary) {
      await Product.findOneAndUpdate(
        { name: item.productName },
        { $inc: { quantity: item.quantity } }
      );
    }

    // Update order status to Cancelled
    order.status = 'Cancelled';
    await order.save();

    res.status(200).json({ message: 'Order cancelled and stock restored', order });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

// Complete order and save to income (Admin only)
router.post('/complete/:orderId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Mark order as completed
    order.status = 'Completed';
    await order.save();

    // Save to Income collection
    const Income = require('../models/Income');
    const income = new Income({
      orderId: order._id,
      amount: order.totalAmount,
    });
    await income.save();

    res.status(200).json({ message: 'Order completed and income recorded', order });
  } catch (error) {
    console.error('Error completing order:', error);
    res.status(500).json({ error: 'Failed to complete order' });
  }
});

module.exports = router;
