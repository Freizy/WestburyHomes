const express = require('express');
const router = express.Router();
const { run, query } = require('../database/database');
const nodemailer = require('nodemailer');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Simple HTML escape to prevent XSS in stored messages
const escapeHtml = (unsafe) => {
  return unsafe
    ? unsafe.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
    : unsafe;
};

// Create contact inquiry
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message, property_id } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and message are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }

    // Escape potentially unsafe HTML
    const safeMessage = escapeHtml(message);

    // Insert into database
    const result = await run(
      `INSERT INTO contact_inquiries 
       (name, email, phone, message, property_id, status) 
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [name, email, phone || null, safeMessage, property_id || null]
    );

    const insertedId = result.insertId || result.id;

    // Send email notification (if configured)
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

        const mailOptions = {
          from: process.env.SMTP_USER,
          to: process.env.ADMIN_EMAIL || 'admin@luxuryapartmentsaccra.com',
          subject: 'New Contact Inquiry - Luxury Apartments Accra',
          text: `New inquiry from ${name} (${email}).
Phone: ${phone || 'Not provided'}
Message: ${message}
${property_id ? `Property ID: ${property_id}` : ''}`,
          html: `
            <h2>New Contact Inquiry</h2>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Message:</strong></p>
            <p>${safeMessage}</p>
            ${property_id ? `<p><strong>Property ID:</strong> ${property_id}</p>` : ''}
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          `
        };

        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error('Email sending failed:', emailError.message);
        // Continue silently if email fails
      }
    }

    res.status(201).json({
      success: true,
      message: 'Contact inquiry submitted successfully',
      data: {
        id: insertedId,
        name,
        email,
        phone,
        message,
        property_id,
        status: 'pending'
      }
    });

  } catch (error) {
    console.error('Error creating contact inquiry:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit contact inquiry'
    });
  }
});

// Get all contact inquiries (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const inquiries = await query(
      `SELECT ci.*, p.title as property_title 
       FROM contact_inquiries ci 
       LEFT JOIN properties p ON ci.property_id = p.id 
       ORDER BY ci.created_at DESC`
    );

    res.json({
      success: true,
      data: inquiries,
      count: inquiries.length
    });
  } catch (error) {
    console.error('Error fetching contact inquiries:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contact inquiries'
    });
  }
});

// Update contact inquiry status (admin only)
router.patch('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'contacted', 'resolved', 'spam'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Valid status is required (pending, contacted, resolved, spam)'
      });
    }

    const result = await run(
      'UPDATE contact_inquiries SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0 && result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Contact inquiry not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact inquiry status updated successfully'
    });

  } catch (error) {
    console.error('Error updating contact inquiry:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update contact inquiry'
    });
  }
});

// Get contact inquiry by ID (admin only)
router.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const inquiries = await query(
      `SELECT ci.*, p.title as property_title 
       FROM contact_inquiries ci 
       LEFT JOIN properties p ON ci.property_id = p.id 
       WHERE ci.id = ?`,
      [id]
    );

    if (inquiries.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Contact inquiry not found'
      });
    }

    res.json({
      success: true,
      data: inquiries[0]
    });

  } catch (error) {
    console.error('Error fetching contact inquiry:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contact inquiry'
    });
  }
});

// Get contact statistics (admin only)
router.get('/stats/overview', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const stats = await query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'contacted' THEN 1 ELSE 0 END) as contacted,
        SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved,
        SUM(CASE WHEN status = 'spam' THEN 1 ELSE 0 END) as spam
      FROM contact_inquiries
    `);

    res.json({
      success: true,
      data: stats[0]
    });

  } catch (error) {
    console.error('Error fetching contact statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contact statistics'
    });
  }
});

module.exports = router;
