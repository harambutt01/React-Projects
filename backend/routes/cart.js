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

// --- 2. POST (Add to Cart with Auto-Quantity & Auto-Total) ---
router.post('/', (req, res) => {
    const { user_id, productId, price, category, quantity } = req.body;

    // Validation
    if (!user_id || !productId || !price) {
        return res.status(400).json({ error: "Required fields are missing (user_id, productId, or price)" });
    }

    // Initial total price calculation for first-time insert
    const currentTotal = Number(price) * Number(quantity);

    /**
     * SQL Logic Explanation for Senior:
     * 1. INSERT: Nayi row bnanay ki koshish karta hai.
     * 2. ON DUPLICATE KEY UPDATE: Agar user_id aur product_id pehle se mojood hain:
     *    - Quantity ko purani quantity mein jama (+) karta hai.
     *    - Total Price ko (New Quantity * Price) karke update karta hai.
     */
    const sql = `
        INSERT INTO cart (user_id, product_id, price, total_price, category, quantity) 
        VALUES (?, ?, ?, ?, ?, ?) 
        ON DUPLICATE KEY UPDATE 
            quantity = quantity + VALUES(quantity),
            total_price = (quantity + VALUES(quantity)) * price
    `;
    
    const values = [user_id, productId, price, currentTotal, category, quantity];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("MySQL Error:", err);
            return res.status(500).json({ error: "Database operation failed" });
        }
        res.status(201).json({ 
            message: "Cart updated successfully!", 
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

// --- 4. CLEAR CART (Optional: Checkout ke baad use hoga) ---
router.delete('/clear/:user_id', (req, res) => {
    const { user_id } = req.params;
    const sql = "DELETE FROM cart WHERE user_id = ?";

    db.query(sql, [user_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Cart cleared" });
    });
});

module.exports = router;