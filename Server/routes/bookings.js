const express = require('express');
const router = express.Router();
const { run, query } = require('../database/database');
const nodemailer = require('nodemailer');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Create new booking
router.post('/', async (req, res) => {
  try {
    console.log('Received booking request:', req.body);

    const {
      property_id,
      guest_name,
      guest_email,
      guest_phone,
      check_in_date,
      check_out_date,
      guests_count,
      total_amount,
      special_requests
    } = req.body;

    // Validation
    if (
      !property_id ||
      !guest_name ||
      !guest_email ||
      !guest_phone ||
      !check_in_date ||
      !check_out_date ||
      !guests_count ||
      !total_amount
    ) {
      return res.status(400).json({
        success: false,
        error: 'All required fields must be provided'
      });
    }

    if (isNaN(guests_count) || isNaN(total_amount)) {
      return res.status(400).json({
        success: false,
        error: 'Guests count and total amount must be valid numbers'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guest_email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }

    // Date validation
    const checkIn = new Date(check_in_date);
    const checkOut = new Date(check_out_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      return res.status(400).json({
        success: false,
        error: 'Check-in date cannot be in the past'
      });
    }

    if (checkOut <= checkIn) {
      return res.status(400).json({
        success: false,
        error: 'Check-out date must be after check-in date'
      });
    }

    // Property availability
    const properties = await query(
      'SELECT * FROM properties WHERE id = ? AND available = 1',
      [property_id]
    );

    if (properties.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Property not found or not available'
      });
    }

    // Booking conflicts
    const conflictingBookings = await query(
      `
      SELECT * FROM bookings 
      WHERE property_id = ? 
      AND status IN ('confirmed', 'pending')
      AND (
        (check_in_date <= ? AND check_out_date > ?) OR
        (check_in_date < ? AND check_out_date >= ?) OR
        (check_in_date >= ? AND check_out_date <= ?)
      )
    `,
      [
        property_id,
        check_in_date,
        check_in_date,
        check_out_date,
        check_out_date,
        check_in_date,
        check_out_date
      ]
    );

    if (conflictingBookings.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Property is not available for the selected dates'
      });
    }

    // Insert booking
    const result = await run(
      `
      INSERT INTO bookings 
      (property_id, guest_name, guest_email, guest_phone, check_in_date, check_out_date, guests_count, total_amount, special_requests)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        property_id,
        guest_name,
        guest_email,
        guest_phone,
        check_in_date,
        check_out_date,
        guests_count,
        total_amount,
        special_requests || null
      ]
    );

    // Confirmation email
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT || 587,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });

        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: guest_email,
          subject: 'Booking Confirmation - Luxury Apartments Accra',
          html: `
            <h2>Booking Confirmation</h2>
            <p>Dear ${guest_name},</p>
            <p>Thank you for choosing Luxury Apartments Accra. Your booking has been received and is being processed.</p>
            <h3>Booking Details:</h3>
            <p><strong>Property:</strong> ${properties[0].title}</p>
            <p><strong>Check-in:</strong> ${new Date(check_in_date).toLocaleDateString()}</p>
            <p><strong>Check-out:</strong> ${new Date(check_out_date).toLocaleDateString()}</p>
            <p><strong>Guests:</strong> ${guests_count}</p>
            <p><strong>Total Amount:</strong> $${total_amount}</p>
            <p><strong>Booking ID:</strong> ${result.insertId}</p>
          `
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        id: result.insertId,
        property_id,
        guest_name,
        guest_email,
        guest_phone,
        check_in_date,
        check_out_date,
        guests_count,
        total_amount,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create booking'
    });
  }
});

// Stats route BEFORE /:id
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(total_amount) as total_revenue
      FROM bookings
    `);

    res.json({
      success: true,
      data: stats[0]
    });
  } catch (error) {
    console.error('Error fetching booking statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch booking statistics'
    });
  }
});

// Availability route BEFORE /:id
router.get('/availability/:property_id', async (req, res) => {
  try {
    const { property_id } = req.params;
    const { check_in_date, check_out_date } = req.query;

    if (!check_in_date || !check_out_date) {
      return res.status(400).json({
        success: false,
        error: 'Check-in and check-out dates are required'
      });
    }

    const conflictingBookings = await query(
      `
      SELECT * FROM bookings 
      WHERE property_id = ? 
      AND status IN ('confirmed', 'pending')
      AND (
        (check_in_date <= ? AND check_out_date > ?) OR
        (check_in_date < ? AND check_out_date >= ?) OR
        (check_in_date >= ? AND check_out_date <= ?)
      )
    `,
      [property_id, check_in_date, check_in_date, check_out_date, check_out_date, check_in_date, check_out_date]
    );

    const isAvailable = conflictingBookings.length === 0;

    res.json({
      success: true,
      data: {
        property_id,
        check_in_date,
        check_out_date,
        available: isAvailable,
        conflicting_bookings: isAvailable ? [] : conflictingBookings
      }
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check availability'
    });
  }
});

// Get all bookings (admin)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, property_id } = req.query;

    let sql = `
      SELECT b.*, p.title as property_title, p.location 
      FROM bookings b 
      JOIN properties p ON b.property_id = p.id
    `;
    const params = [];

    if (status) {
      sql += ' WHERE b.status = ?';
      params.push(status);
    } else if (property_id) {
      sql += ' WHERE b.property_id = ?';
      params.push(property_id);
    }

    sql += ' ORDER BY b.created_at DESC';

    const bookings = await query(sql, params);

    res.json({
      success: true,
      data: bookings,
      count: bookings.length
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bookings'
    });
  }
});

// Get booking by ID (AFTER specific routes)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const bookings = await query(
      `
      SELECT b.*, p.title as property_title, p.location, p.address
      FROM bookings b 
      JOIN properties p ON b.property_id = p.id
      WHERE b.id = ?
    `,
      [id]
    );

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: bookings[0]
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch booking'
    });
  }
});

// Update booking status
router.patch('/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Valid status is required (pending, confirmed, cancelled, completed)'
      });
    }

    const result = await run('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking status updated successfully'
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update booking status'
    });
  }
});

module.exports = router;
