const express = require('express');
const path = require('path');
const db = require(path.resolve(__dirname, '../db.js'));
const router = express.Router();



router.post('/', async (req, res) => {
  try {
    // Ab hum req.body se image_url uthayenge
    const { name, price, description, stock, category_id, seller_id, image_url } = req.body;

    if (!name || !price || !stock || !category_id || !seller_id || !image_url) {
      return res.status(400).json({ error: 'All fields including image URL are required' });
    }

    const sql = "INSERT INTO products (name, price, description, stock, category_id, seller_id, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const [result] = await db.query(sql, [name, parseFloat(price), description, parseInt(stock), parseInt(category_id), parseInt(seller_id), image_url]);
    
    res.status(201).json({ message: 'Product added successfully!', productId: result.insertId });
  } catch (error) {
    console.error("Add Product Error:", error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// GET: Fetch all products
router.get('/', async (req, res) => {
  try {
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

    const countSql = `SELECT COUNT(*) AS total FROM products p LEFT JOIN categories c ON p.category_id = c.id ${where}`;
    const [countResult] = await db.query(countSql, params);
    const total = countResult[0]?.total || 0;

    const sql = `
      SELECT p.id, p.name, p.price, p.description, p.category_id, c.name AS category,
             p.seller_id, s.store_name AS seller, p.image_url AS image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN sellers s ON p.seller_id = s.id
      ${where} ${order} LIMIT ? OFFSET ?
    `;

    const [rows] = await db.query(sql, [...params, limit, offset]);
    res.json({ products: rows, total, page: pageNumber, pageSize: limit });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch products' });
  }
});

// GET: Fetch single product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT p.*, c.name AS category, s.store_name AS seller FROM products p LEFT JOIN categories c ON p.category_id = c.id LEFT JOIN sellers s ON p.seller_id = s.id WHERE p.id = ?";
    const [rows] = await db.query(sql, [id]);
    if (!rows.length) return res.status(404).json({ error: 'Product not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch product' });
  }
});

// PUT: Update product
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, stock, category_id, seller_id, image_url } = req.body;

    const sql = `UPDATE products SET name=?, price=?, description=?, stock=?, category_id=?, seller_id=?, image_url=? WHERE id=?`;
    const params = [name, parseFloat(price), description, parseInt(stock), parseInt(category_id), parseInt(seller_id), image_url, id];

    await db.query(sql, params);
    res.json({ message: 'Product updated successfully!' });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE: Delete product
router.delete('/:id', async (req, res) => {
  try {
    await db.query("DELETE FROM products WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Cannot delete product" });
  }
});

// GET: Related products
router.get('/related/:category/:id', async (req, res) => {
  try {
    const { category, id } = req.params;
    const sql = `
      SELECT p.id, p.name, p.price, p.image_url AS image, c.name AS category
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE c.name = ? AND p.id != ?
      ORDER BY RAND() LIMIT 8
    `;
    const [rows] = await db.query(sql, [category, id]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch related products' });
  }
});

module.exports = router;