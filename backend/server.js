const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes');
const User = require('./models/User');
const Product = require('./models/Product');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const couponRoutes = require('./routes/couponRoutes');


dotenv.config();
const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected successfully');
    insertDefaultProducts();
    createDefaultAdmin();
  })
  .catch((err) => console.log('Error:', err));

app.use(cors());
app.use(express.json());



const insertDefaultProducts = async () => {
    try {
      const productsCount = await Product.countDocuments();
      if (productsCount === 0) {
        console.log('No products found. Inserting default products...');
        const defaultProducts = [
          {
            name: 'Apple iPhone 14',
            price: 999.99,
            quantity: 50,
            description: 'The latest iPhone model with improved features and design.',
            image: 'https://example.com/images/iphone14.jpg',
          },
          {
            name: 'Apple MacBook Pro 16"',
            price: 2399.99,
            quantity: 15,
            description: 'Powerful laptop for creative professionals with a 16-inch Retina display.',
            image: 'https://https://cdn.shopify.com/s/files/1/0471/6039/3896/files/air13teaser_480x480.jpg?v=1602593515.com/images/macbook_pro.jpg',
          },
        ];
  
        await Product.insertMany(defaultProducts);
        console.log('Default products inserted.');
      } else {
        console.log('Products already exist in the database.');
      }
    } catch (error) {
      console.error('Error inserting default products:', error);
    }
  };


// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/coupons', couponRoutes);


// Root API route
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the API', status: 'success' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Function to create a default admin user
async function createDefaultAdmin() {
  try {
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('1', 10);
      const adminUser = new User({
        name: 'Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        isAdmin: true,
      });
      await adminUser.save();
      console.log('Default admin user created');
    }
  } catch (error) {
    console.error('Error creating default admin user:', error);
  }
}
