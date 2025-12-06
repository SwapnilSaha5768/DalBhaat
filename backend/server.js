const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes');
const User = require('./models/User');
const Product = require('./models/Product');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const couponRoutes = require('./routes/couponRoutes');
const incomeRoutes = require('./routes/incomeRoutes');


dotenv.config();
const app = express();

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    createDefaultAdmin();
    insertDefaultProducts();
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
          name: 'Apple',
          price: 20.99,
          quantity: 50,
          description: 'Fresh Quality green apple.',
          image: 'https://www.buildrestfoods.com/wp-content/uploads/2020/08/green-apply.jpg',
        },
      ];

      await Product.insertMany(defaultProducts);
    } else {
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
app.use('/api/income', incomeRoutes);


app.get('/api', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.json({
    message: 'Welcome to the API',
    status: 'success',
    dbStatus,
    env: process.env.NODE_ENV
  });
});


module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
async function createDefaultAdmin() {
  try {
    await User.deleteOne({ email: 'admin@example.com' });

    const adminUser = new User({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin123',
      isAdmin: true,
    });
    await adminUser.save();
    console.log('Default admin user created.');
  } catch (error) {
    console.error('Error creating default admin user:', error);
  }
}
