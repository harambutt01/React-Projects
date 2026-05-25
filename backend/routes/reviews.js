const express = require('express');
const router = express.Router({ mergeParams: true });
const db = require('../db'); 


// 1. GET Reviews for a specific product
router.get('/', async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Query: Fetch reviews for the given product ID
    const sql = `
      SELECT reviewer_name AS reviewerName, comment, rating, created_at AS date 
      FROM reviews 
      WHERE product_id = ? 
      ORDER BY created_at DESC
    `;
    
    const [rows] = await db.execute(sql, [productId]);
    
    return res.status(200).json({ 
      productId, 
      reviews: rows 
    });
  } catch (err) {
    console.error("GET Reviews Error:", err);
    return res.status(500).json({ error: "Failed to fetch reviews from database" });
  }
});

// 2. POST a new review for a specific product
router.post('/', async (req, res) => {
  try {
    const { productId } = req.params;
    const { reviewerName, comment, rating } = req.body;

    // Basic validation
    if (!reviewerName || !comment || !rating) {
      return res.status(400).json({ error: "All fields (name, comment, rating) are required" });
    }

    const sql = "INSERT INTO reviews (product_id, reviewer_name, comment, rating) VALUES (?, ?, ?, ?)";
    
    await db.execute(sql, [productId, reviewerName, comment, rating]);
    
    return res.status(201).json({ 
      status: "Success", 
      message: "Review saved successfully" 
    });
  } catch (err) {
    console.error("POST Review Error:", err);
    return res.status(500).json({ error: "Failed to save review to database" });
  }
});

module.exports = router;