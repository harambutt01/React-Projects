const express = require('express');
const db = require('../server'); // Make sure this points to your server.js
const router = express.Router({ mergeParams: true });

// 1. GET Reviews
router.get('/', (req, res) => {
  const { productId } = req.params;
  const sql = "SELECT reviewer_name AS reviewerName, comment, rating, created_at AS date FROM reviews WHERE product_id = ? ORDER BY created_at DESC";
  
  db.query(sql, [productId], (err, data) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    return res.json({ productId, reviews: data });
  });
});

// 2. POST Review
router.post('/', (req, res) => {
  const { productId } = req.params;
  const { reviewerName, comment, rating } = req.body;

  if (!reviewerName || !comment || !rating) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = "INSERT INTO reviews (product_id, reviewer_name, comment, rating) VALUES (?, ?, ?, ?)";
  
  db.query(sql, [productId, reviewerName, comment, rating], (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Failed to save review" });
    }
    return res.status(201).json({ 
      status: "Success", 
      message: "Review saved to database",
      review: { reviewerName, comment, rating, date: new Date().toISOString() }
    });
  });
});

module.exports = router;