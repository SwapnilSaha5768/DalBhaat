const Product = require('../models/Product');
const User = require('../models/User');


// Create a product
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Edit a product
exports.editProduct = async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedProduct);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  // Delete a product
  exports.deleteProduct = async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

 
  // Edit user role to make admin
exports.makeUserAdmin = async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, { isAdmin: true }, { new: true });
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  