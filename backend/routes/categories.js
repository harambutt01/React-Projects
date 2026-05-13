const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name FROM categories ORDER BY name');
    res.json({ categories: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch categories' });
  }
});

module.exports = router;
