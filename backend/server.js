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
const cookieParser = require('cookie-parser');

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

app.use(cookieParser());
app.set('trust proxy', 1); // Trust first proxy (critical for Vercel/Render/Heroku)
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://www.dalbhaat.vercel.app'],
  credentials: true
}));
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
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL;
    const adminPass = process.env.DEFAULT_ADMIN_PASS;
    if (!adminEmail || !adminPass) {
      return;
    }

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const adminUser = new User({
        name: 'Admin',
        email: adminEmail,
        password: adminPass,
        isAdmin: true,
      });
      await adminUser.save();
      console.log('Environment-configured initial admin user created.');
    }
  } catch (error) {
    console.error('Error in createDefaultAdmin:', error);
  }
}
