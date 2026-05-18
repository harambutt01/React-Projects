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
    const { user_id, productId, image, price, category, quantity } = req.body;

    // Validation
    if (!user_id || !productId || !price) {
        return res.status(400).json({ error: "Required fields are missing (user_id, productId, or price)" });
    }

    // Initial total price calculation
    const currentTotal = Number(price) * Number(quantity);

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

// --- 3. MULTI-DELETE (Database Column Fixed to product_id) ---
// Note: Isay single delete se upar hi rakha hai taake route break na ho
router.delete('/delete-multiple', (req, res) => {
    const { ids } = req.body; 

    // Validation
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ status: "Error", message: "No product IDs provided for deletion" });
    }

    // FIXED: 'id' ki jagah 'product_id' kiya taake database table ke sahi column se matching ho sake
    const sql = `DELETE FROM cart WHERE product_id IN (${ids.join(',')})`;

    db.query(sql, (err, result) => {
        if (err) {
            console.error("Database error during bulk delete:", err);
            return res.status(500).json({ status: "Error", error: err.message });
        }
        res.json({ 
            status: "Success", 
            message: "Selected items removed from database", 
            affectedRows: result.affectedRows 
        });
    });
});

// --- 4. DELETE (Remove single item) ---
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM cart WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Item removed from cart" });
    });
});

// --- 5. CLEAR CART ---
router.delete('/clear/:user_id', (req, res) => {
    const { user_id } = req.params;
    const sql = "DELETE FROM cart WHERE user_id = ?";

    db.query(sql, [user_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Cart cleared" });
    });
});

module.exports = router;