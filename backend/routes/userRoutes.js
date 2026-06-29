const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const rateLimit = require('express-rate-limit');
const adminMiddleware = require('../middleware/adminMiddleware');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many authentication attempts, please try again later.' }
});

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many password reset attempts, please try again later.' }
});

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many contact messages sent. Please wait before trying again.' }
});

const router = express.Router();

// Contact Us Route
router.post('/contact', contactLimiter, async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required.' });
  }

  try {
    const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const mailOptions = {
      to: smtpUser,
      from: `DalBhaat Store <${smtpUser}>`,
      replyTo: email,
      subject: `New Customer Inquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
          <h2 style="color: #ff1e00; border-bottom: 2px solid #ff1e00; padding-bottom: 10px;">New Customer Inquiry</h2>
          <p><strong>Customer Name:</strong> ${name}</p>
          <p><strong>Customer Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Message:</strong></p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; white-space: pre-wrap; font-size: 14px; color: #333;">${message}</div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Message sent successfully! We will get back to you soon.' });
  } catch (err) {
    console.error('Contact email error:', err);
    res.status(500).json({ message: 'Failed to send message. Please try again later.' });
  }
});


router.post('/register', authLimiter, async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      name,
      email,
      password,
      isAdmin: false,
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 3600000 // 1 hour
    });

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (Admin only)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find({}, 'name email isAdmin'); // Fetch only name and email
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

router.post('/login', authLimiter, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 3600000 // 1 hour
    });

    res.json({
      success: true,
      message: 'Login successful',
      isAdmin: user.isAdmin,
      userId: user._id.toString(),
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Google Login Route
router.post('/google-login', authLimiter, async (req, res) => {
  const { token: googleToken } = req.body;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      // Create new user for google registration
      const randomPassword = crypto.randomBytes(16).toString('hex');
      user = new User({
        name: name || email.split('@')[0],
        email,
        password: randomPassword,
        googleId,
        avatar: picture || '',
      });
      await user.save();
    } else if (!user.googleId) {
      user.googleId = googleId;
      if (!user.avatar && picture) user.avatar = picture;
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 3600000
    });

    res.json({
      success: true,
      message: 'Google authentication successful',
      isAdmin: user.isAdmin,
      userId: user._id.toString(),
    });
  } catch (err) {
    console.error('Google Auth error:', err);
    res.status(400).json({ success: false, message: 'Google authentication failed' });
  }
});

// Forgot Password Route (OTP Generation)
router.post('/forgot-password', otpLimiter, async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpires = Date.now() + 600000; // 10 minutes

    await user.save();

    const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const mailOptions = {
      to: user.email,
      from: `DalBhaat Support <${smtpUser}>`,
      subject: 'Password Reset OTP - DalBhaat',
      text: `Your One-Time Password (OTP) for resetting your account password is: ${otp}. This code is valid for 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; rounded-lg: 10px;">
          <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
          <p style="color: #555; font-size: 14px;">You have requested to reset your password for your DalBhaat account. Please use the 6-digit OTP below to verify your request:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; font-family: monospace; letter-spacing: 6px; background-color: #f0f2f5; padding: 12px 24px; border-radius: 8px; color: #ff1e00; border: 1px solid #ff1e00;">${otp}</span>
          </div>
          <p style="color: #777; font-size: 13px; text-align: center;">This OTP is valid for 10 minutes. If you did not request a password reset, please ignore this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'OTP sent successfully to your email' });

  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error sending OTP' });
  }
});

// Reset Password Route (OTP Verification)
router.post('/reset-password', otpLimiter, async (req, res) => {
  const { email, otp, password } = req.body;
  try {
    const user = await User.findOne({
      email,
      resetOtp: otp,
      resetOtpExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.password = password;
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password has been updated successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error resetting password' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });
  res.json({ message: 'Logged out successfully' });
});

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, bio, phone, address, addresses, avatar } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.phone = phone || user.phone;
    user.address = address || user.address; // Keep updating legacy field if provided

    if (addresses) {
      user.addresses = addresses;
    }

    user.avatar = avatar || user.avatar;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      bio: updatedUser.bio,
      phone: updatedUser.phone,
      address: updatedUser.address,
      addresses: updatedUser.addresses,
      avatar: updatedUser.avatar,
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user password
router.put('/profile/password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid current password' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Error updating password:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.id !== id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error('Error updating user:', err.message);
    res.status(500).json({ message: 'Failed to update user' });
  }
});


router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.id !== id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err.message);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

router.get('/admins', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const adminUsers = await User.find({ isAdmin: true });
    res.status(200).json(adminUsers);
  } catch (error) {
    console.error('Error fetching admin users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
