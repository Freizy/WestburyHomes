const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { run, query } = require('../database/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// -------------------- REGISTER --------------------
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username, email, and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }

    // Check if user exists
    const existingUsers = await query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Username or email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const result = await run(
      'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [username, email, passwordHash, 'admin']
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: result.insertId, // ✅ MySQL insertId
        username,
        email,
        role: 'admin'
      }
    });

  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to register user'
    });
  }
});

// -------------------- LOGIN --------------------
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required'
      });
    }

    const users = await query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, username]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const user = users[0];

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      }
    });

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to login'
    });
  }
});

// -------------------- AUTH MIDDLEWARE --------------------
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// -------------------- GET PROFILE --------------------
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const users = await query(
      'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, data: users[0] });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user profile' });
  }
});

// -------------------- UPDATE PROFILE --------------------
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({
        success: false,
        error: 'Username and email are required'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Please provide a valid email' });
    }

    const existingUsers = await query(
      'SELECT * FROM users WHERE (username = ? OR email = ?) AND id != ?',
      [username, email, req.user.id]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ success: false, error: 'Username or email already exists' });
    }

    const result = await run(
      'UPDATE users SET username = ?, email = ? WHERE id = ?',
      [username, email, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { id: req.user.id, username, email, role: req.user.role }
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
});

// -------------------- CHANGE PASSWORD --------------------
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: 'Both passwords are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'New password must be at least 6 chars' });
    }

    const users = await query('SELECT * FROM users WHERE id = ?', [req.user.id]);

    if (users.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const user = users[0];

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect' });
    }

    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    const result = await run('UPDATE users SET password_hash = ? WHERE id = ?', [newPasswordHash, req.user.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, message: 'Password changed successfully' });

  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ success: false, error: 'Failed to change password' });
  }
});

// -------------------- LOGOUT --------------------
router.post('/logout', authenticateToken, (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;
