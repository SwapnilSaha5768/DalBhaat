
const Product = require('../models/Product');


exports.createProduct = async (req, res) => {
  try {
    const { name, price, quantity, description, image } = req.body;
    const newProduct = new Product({ name, price, quantity, description, image });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Failed to create product', error });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products', error });
  }
};
