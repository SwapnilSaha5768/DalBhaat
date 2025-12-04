const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  bio: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' }, // Deprecated but kept for backward compatibility
  addresses: [{
    street: { type: String, required: true },
    city: { type: String, default: '' },
    zip: { type: String, default: '' },
    isDefault: { type: Boolean, default: false }
  }],
  avatar: { type: String, default: '' },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', UserSchema);
