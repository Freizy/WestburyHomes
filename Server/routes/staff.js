const express = require('express');
const router = express.Router();
const { query, run } = require('../database/database');
const { authenticateToken, requireAdmin, requireSuperAdmin, login, registerAdmin } = require('../middleware/auth');

// ---------------- AUTH ----------------

// Login
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const result = await login(email, password);

    if (!result.success) {
      return res.status(401).json({ success: false, message: result.message });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// Get all admins (superadmin only)
router.get('/auth/admins', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const admins = await query(
      'SELECT id, username, email, role, created_at FROM users WHERE role IN ("admin","superadmin") ORDER BY created_at DESC'
    );
    res.json({ success: true, data: admins });
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch admin users' });
  }
});

// Register new admin (superadmin only)
router.post('/auth/register', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Username, email and password are required' });
    }

    const result = await registerAdmin(username, email, password);

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }

    res.json({ success: true, message: result.message });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

// ---------------- STAFF ----------------

// Public staff list
router.get('/staff', async (req, res) => {
  try {
    const staff = await query(
      'SELECT id, name, position FROM staff WHERE status = "active" ORDER BY name'
    );
    res.json({ success: true, data: staff });
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch staff' });
  }
});

// Admin staff management (superadmin only)
router.get('/staff/admin', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const staff = await query('SELECT * FROM staff ORDER BY created_at DESC');
    res.json({ success: true, data: staff });
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch staff' });
  }
});

// Add staff
router.post('/staff', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { name, position, email, phone } = req.body;
    if (!name || !position || !email || !phone) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const result = await run(
      'INSERT INTO staff (name, position, email, phone) VALUES (?, ?, ?, ?)',
      [name, position, email, phone]
    );

    res.json({
      success: true,
      message: 'Staff member added successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error adding staff:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    res.status(500).json({ success: false, message: 'Failed to add staff member' });
  }
});

// ---------------- ATTENDANCE ----------------

router.get('/attendance', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const attendance = await query(`
      SELECT 
        a.id, a.date, a.time_in, a.time_out, a.status,
        s.name as staffName, s.position
      FROM attendance a
      JOIN staff s ON a.staff_id = s.id
      ORDER BY a.date DESC, a.time_in DESC
    `);
    res.json({ success: true, data: attendance });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch attendance' });
  }
});

router.post('/attendance/login', async (req, res) => {
  try {
    const { staffId } = req.body;
    if (!staffId) return res.status(400).json({ success: false, message: 'Staff ID is required' });

    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toISOString().slice(11, 19);

    const existingLog = await query(
      'SELECT * FROM attendance WHERE staff_id = ? AND date = ? AND status = "active"',
      [staffId, today]
    );

    if (existingLog.length > 0) {
      return res.status(400).json({ success: false, message: 'Already logged in today' });
    }

    const result = await run(
      'INSERT INTO attendance (staff_id, date, time_in, status) VALUES (?, ?, ?, ?)',
      [staffId, today, currentTime, 'active']
    );

    const staff = await query('SELECT name FROM staff WHERE id = ?', [staffId]);

    res.json({
      success: true,
      message: 'Successfully logged in',
      data: {
        id: result.insertId,
        staffName: staff[0]?.name,
        date: today,
        timeIn: currentTime,
        status: 'active'
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ success: false, message: 'Failed to log in' });
  }
});

router.post('/attendance/logout', async (req, res) => {
  try {
    const { staffId } = req.body;
    if (!staffId) return res.status(400).json({ success: false, message: 'Staff ID is required' });

    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toISOString().slice(11, 19);

    const attendance = await query(
      'SELECT * FROM attendance WHERE staff_id = ? AND date = ? AND status = "active"',
      [staffId, today]
    );

    if (attendance.length === 0) {
      return res.status(400).json({ success: false, message: 'No active session found' });
    }

    await run(
      'UPDATE attendance SET time_out = ?, status = "completed" WHERE id = ?',
      [currentTime, attendance[0].id]
    );

    res.json({ success: true, message: 'Successfully logged out' });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ success: false, message: 'Failed to log out' });
  }
});

// ---------------- INVENTORY ----------------

router.get('/inventory', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const inventory = await query('SELECT * FROM inventory ORDER BY last_updated DESC');

    const updatedInventory = inventory.map(item => ({
      ...item,
      status: item.quantity <= item.min_quantity ? 'low-stock' : 'in-stock'
    }));

    res.json({ success: true, data: updatedInventory });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch inventory' });
  }
});

router.post('/inventory', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, category, quantity, minQuantity, unit } = req.body;
    if (!name || !category || !quantity || !minQuantity || !unit) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const result = await run(
      'INSERT INTO inventory (name, category, quantity, min_quantity, unit) VALUES (?, ?, ?, ?, ?)',
      [name, category, quantity, minQuantity, unit]
    );

    res.json({ success: true, message: 'Inventory item added successfully', data: { id: result.insertId } });
  } catch (error) {
    console.error('Error adding inventory:', error);
    res.status(500).json({ success: false, message: 'Failed to add inventory item' });
  }
});

router.put('/inventory/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    if (!quantity) return res.status(400).json({ success: false, message: 'Quantity is required' });

    await run('UPDATE inventory SET quantity = ?, last_updated = CURRENT_TIMESTAMP WHERE id = ?', [quantity, id]);
    res.json({ success: true, message: 'Inventory updated successfully' });
  } catch (error) {
    console.error('Error updating inventory:', error);
    res.status(500).json({ success: false, message: 'Failed to update inventory' });
  }
});

// ---------------- DASHBOARD ----------------

router.get('/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const totalStaff = await query('SELECT COUNT(*) as count FROM staff WHERE status = "active"');
    const activeStaff = await query(
      'SELECT COUNT(DISTINCT staff_id) as count FROM attendance WHERE date = ? AND status = "active"',
      [today]
    );
    const lowStockItems = await query(
      'SELECT COUNT(*) as count FROM inventory WHERE quantity <= min_quantity'
    );

    const totalStaffCount = totalStaff[0]?.count || 0;
    const activeStaffCount = activeStaff[0]?.count || 0;
    const attendanceRate = totalStaffCount > 0 ? Math.round((activeStaffCount / totalStaffCount) * 100) : 0;

    res.json({
      success: true,
      data: {
        totalStaff: totalStaffCount,
        activeStaff: activeStaffCount,
        lowStockItems: lowStockItems[0]?.count || 0,
        attendanceRate
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard statistics' });
  }
});

module.exports = router;
