const express = require('express');
const db = require('../db');
const router = express.Router();

// --- 🟢 UPDATED GET ALL PRODUCTS (Limit 100) ---
router.get('/', async (req, res) => {
  try {
    // Senior's Request: Default pageSize ko 20 se barha kar 100 kar diya
    const { search, category, sort, page = '1', pageSize = '100' } = req.query; 
    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limit = Math.max(1, parseInt(pageSize, 10) || 100); 
    const offset = (pageNumber - 1) * limit;

    let whereClauses = [];
    const params = [];

    if (search) {
      whereClauses.push('p.name LIKE ?');
      params.push(`%${search}%`);
    }
    if (category) {
      whereClauses.push('c.name = ?');
      params.push(category);
    }

    const where = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const order = sort && ['asc', 'desc'].includes(sort.toLowerCase())
      ? `ORDER BY p.price ${sort.toUpperCase()}`
      : 'ORDER BY p.id ASC';

    // Count Total
    const countSql = `SELECT COUNT(*) AS total FROM products p LEFT JOIN categories c ON p.category_id = c.id ${where}`;
    const [countResult] = await db.query(countSql, params);
    const total = countResult[0]?.total || 0;

    // Fetch Products
    const sql = `
      SELECT
        p.id,
        p.name,
        p.price,
        p.category_id,
        c.name AS category,
        p.seller_id,
        s.store_name AS seller,
        p.image_url AS image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN sellers s ON p.seller_id = s.id
      ${where}
      ${order}
      LIMIT ?
      OFFSET ?
    `;

    const [rows] = await db.query(sql, [...params, limit, offset]);

    res.json({
      products: rows,
      total,
      page: pageNumber,
      pageSize: limit
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch products' });
  }
});

// --- 🟢 NEW POST METHOD ---
router.post('/', async (req, res) => {
  try {
    const { name, price, category_id, seller_id, image_url } = req.body;
    if (!name || !price || !category_id || !seller_id) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const sql = `INSERT INTO products (name, price, category_id, seller_id, image_url) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await db.query(sql, [name, price, category_id, seller_id, image_url || null]);
    res.status(201).json({
      message: 'Product added successfully!',
      productId: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add product to database' });
  }
});

// --- 🟢 GET BY ID ---
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `
      SELECT
        p.id, p.name, p.price, p.category_id,
        c.name AS category, p.seller_id, s.store_name AS seller, p.image_url AS image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN sellers s ON p.seller_id = s.id
      WHERE p.id = ?
    `;
    const [rows] = await db.query(sql, [id]);
    if (!rows.length) return res.status(404).json({ error: 'Product not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch product' });
  }
});

module.exports = router;