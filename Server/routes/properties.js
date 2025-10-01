const express = require('express');
const router = express.Router();
const { query } = require('../database/database');

// Utility: parse JSON fields safely
function formatProperty(property) {
  return {
    ...property,
    amenities: property.amenities ? JSON.parse(property.amenities) : [],
    images: property.images ? JSON.parse(property.images) : []
  };
}

// ✅ Get featured properties (PUT FIRST)
router.get('/featured/list', async (req, res) => {
  try {
    const properties = await query(
      'SELECT * FROM properties WHERE featured = 1 AND available = 1 ORDER BY created_at DESC LIMIT 6'
    );

    res.json({
      success: true,
      data: properties.map(formatProperty)
    });
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch featured properties' });
  }
});

// ✅ Get properties by location
router.get('/location/:location', async (req, res) => {
  try {
    const { location } = req.params;
    const properties = await query(
      'SELECT * FROM properties WHERE location LIKE ? AND available = 1 ORDER BY featured DESC, created_at DESC',
      [`%${location}%`]
    );

    res.json({
      success: true,
      data: properties.map(formatProperty),
      count: properties.length
    });
  } catch (error) {
    console.error('Error fetching properties by location:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch properties by location' });
  }
});

// ✅ Search properties
router.get('/search/query', async (req, res) => {
  try {
    const { q, location, minPrice, maxPrice, bedrooms } = req.query;

    let sql = 'SELECT * FROM properties WHERE available = 1';
    const params = [];

    if (q) {
      sql += ' AND (title LIKE ? OR description LIKE ? OR location LIKE ?)';
      const term = `%${q}%`;
      params.push(term, term, term);
    }

    if (location) {
      sql += ' AND location LIKE ?';
      params.push(`%${location}%`);
    }

    if (minPrice && !isNaN(minPrice)) {
      sql += ' AND price >= ?';
      params.push(Number(minPrice));
    }

    if (maxPrice && !isNaN(maxPrice)) {
      sql += ' AND price <= ?';
      params.push(Number(maxPrice));
    }

    if (bedrooms && !isNaN(bedrooms)) {
      sql += ' AND bedrooms >= ?';
      params.push(Number(bedrooms));
    }

    sql += ' ORDER BY featured DESC, created_at DESC';

    const properties = await query(sql, params);

    res.json({
      success: true,
      data: properties.map(formatProperty),
      count: properties.length
    });
  } catch (error) {
    console.error('Error searching properties:', error);
    res.status(500).json({ success: false, error: 'Failed to search properties' });
  }
});

// ✅ Get all properties
router.get('/', async (req, res) => {
  try {
    const { featured, location, minPrice, maxPrice, bedrooms } = req.query;

    let sql = 'SELECT * FROM properties WHERE available = 1';
    const params = [];

    if (featured === 'true') sql += ' AND featured = 1';

    if (location) {
      sql += ' AND location LIKE ?';
      params.push(`%${location}%`);
    }

    if (minPrice && !isNaN(minPrice)) {
      sql += ' AND price >= ?';
      params.push(Number(minPrice));
    }

    if (maxPrice && !isNaN(maxPrice)) {
      sql += ' AND price <= ?';
      params.push(Number(maxPrice));
    }

    if (bedrooms && !isNaN(bedrooms)) {
      sql += ' AND bedrooms >= ?';
      params.push(Number(bedrooms));
    }

    sql += ' ORDER BY featured DESC, created_at DESC';

    const properties = await query(sql, params);

    res.json({
      success: true,
      data: properties.map(formatProperty),
      count: properties.length
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch properties' });
  }
});

// ✅ Get single property by ID (PUT LAST)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const properties = await query(
      'SELECT * FROM properties WHERE id = ? AND available = 1',
      [id]
    );

    if (properties.length === 0) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }

    res.json({
      success: true,
      data: formatProperty(properties[0])
    });
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch property' });
  }
});

module.exports = router;
