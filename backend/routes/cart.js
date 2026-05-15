const express = require('express');
const router = express.Router();
const db = require('../server'); // server.js se database connection import

// --- 1. GET CART (Database se user ka cart lana) ---
router.get('/:user_id', (req, res) => {
    const { user_id } = req.params;
    const sql = "SELECT * FROM cart WHERE user_id = ?";
    
    db.query(sql, [user_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// --- 2. POST (Add to Cart with Image, Auto-Quantity & Auto-Total) ---
router.post('/', (req, res) => {
    // req.body mein ab "image" bhi receive ho rahi hai
    const { user_id, productId, image, price, category, quantity } = req.body;

    // Validation
    if (!user_id || !productId || !price) {
        return res.status(400).json({ error: "Required fields are missing (user_id, productId, or price)" });
    }

    // Initial total price calculation
    const currentTotal = Number(price) * Number(quantity);

    /**
     * SQL Logic:
     * 1. Agar user aur product ka combo naya hai, toh image ke sath insert hoga.
     * 2. Agar duplicate hai, toh sirf quantity aur total_price update honge.
     */
    const sql = `
        INSERT INTO cart (user_id, product_id, image, price, total_price, category, quantity) 
        VALUES (?, ?, ?, ?, ?, ?, ?) 
        ON DUPLICATE KEY UPDATE 
            quantity = quantity + VALUES(quantity),
            total_price = (quantity + VALUES(quantity)) * price
    `;
    
    const values = [user_id, productId, image, price, currentTotal, category, quantity];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("MySQL Error:", err);
            return res.status(500).json({ error: "Database operation failed" });
        }
        res.status(201).json({ 
            message: "Cart updated successfully with image!", 
            details: result 
        });
    });
});

// --- 3. DELETE (Remove single item) ---
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM cart WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Item removed from cart" });
    });
});

// --- 4. CLEAR CART ---
router.delete('/clear/:user_id', (req, res) => {
    const { user_id } = req.params;
    const sql = "DELETE FROM cart WHERE user_id = ?";

    db.query(sql, [user_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Cart cleared" });
    });
});

module.exports = router;