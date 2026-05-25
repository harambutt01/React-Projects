const express = require('express');
const router = express.Router();
// IMPORTANT: Sahi path dein (agar db.js root backend folder mein hai)
const db = require('../db'); 

router.get('/:user_id', async (req, res) => {
    try {
        const { user_id } = req.params;
        const sql = "SELECT * FROM cart WHERE user_id = ?";
        const [results] = await db.query(sql, [user_id]);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { user_id, productId, image_url, price, category, quantity } = req.body;

        if (!user_id || !productId || !price) {
            return res.status(400).json({ error: "Required fields are missing (user_id, productId, or price)" });
        }

        const currentTotal = Number(price) * Number(quantity);

        const sql = `
            INSERT INTO cart (user_id, product_id, image_url, price, total_price, category, quantity) 
            VALUES (?, ?, ?, ?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE 
                quantity = quantity + VALUES(quantity),
                total_price = (quantity + VALUES(quantity)) * price
        `;
        
        const values = [user_id, productId, image_url, price, currentTotal, category, quantity];

        const [result] = await db.query(sql, values);
        res.status(201).json({ 
            message: "Cart updated successfully", 
            details: result 
        });
    } catch (err) {
        console.error("MySQL Error:", err);
        res.status(500).json({ error: "Database operation failed" });
    }
});

router.delete('/delete-multiple', async (req, res) => {
    try {
        const { ids } = req.body; 

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ status: "Error", message: "No product IDs provided" });
        }

        // Secure way: placeholders use karein
        const placeholders = ids.map(() => '?').join(',');
        const sql = `DELETE FROM cart WHERE product_id IN (${placeholders})`;

        const [result] = await db.query(sql, ids);
        res.json({ 
            status: "Success", 
            message: "Selected items removed from cart", 
            affectedRows: result.affectedRows 
        });
    } catch (err) {
        console.error("Error during bulk delete:", err);
        res.status(500).json({ status: "Error", error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "DELETE FROM cart WHERE id = ?";
        await db.query(sql, [id]);
        res.json({ message: "Item removed from cart" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/clear/:user_id', async (req, res) => {
    try {
        const { user_id } = req.params;
        const sql = "DELETE FROM cart WHERE user_id = ?";
        await db.query(sql, [user_id]);
        res.json({ message: "Cart cleared" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;