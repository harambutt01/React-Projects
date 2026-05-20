const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// --- 1. CORE MIDDLEWARE ---
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- 2. STATIC ASSETS (IMAGES) ---
app.use('/assets', express.static(path.join(__dirname, '../public/assets')));

// --- 3. DATABASE CONNECTION ---
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'trendora_db'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to MariaDB/MySQL');
});

// IMPORTANT: Exporting db so other routes can use it
module.exports = db; 

// --- 4. ROUTES IMPORT ---
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const cartRoutes = require('./routes/cart');
const reviewRoutes = require('./routes/reviews');
const checkoutRoutes = require('./routes/checkout');

// --- 5. AUTHENTICATION APIs ---

// Signup API
app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;
  const checkSql = "SELECT * FROM users WHERE email = ?";
  db.query(checkSql, [email], (err, data) => {
    if (err) return res.status(500).json({ status: "Error", message: "Database error" });
    if (data.length > 0) return res.status(400).json({ status: "Error", message: "Email already registered!" });

    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [name, email, password], (err, result) => {
      if (err) return res.status(500).json({ status: "Error", message: "Registration failed" });
      return res.json({ status: "Success", message: "Account created!" });
    });
  });
});

// Login API
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, data) => {
    if (err) return res.status(500).json({ status: "Error", message: "Internal server error" });
    if (data.length > 0) {
      return res.json({ 
        status: "Success", 
        message: "Login Successful!", 
        user: { id: data[0].id, name: data[0].name, email: data[0].email } 
      });
    } else {
      return res.status(401).json({ status: "Error", message: "Invalid credentials" });
    }
  });
});

// --- NEW: SUPPORT TICKET API ---
app.post('/api/support', (req, res) => {
  const { name, email, orderId, issueType, details } = req.body;
  
  const sql = "INSERT INTO support_tickets (name, email, order_id, issue_type, details) VALUES (?, ?, ?, ?, ?)";
  
  db.query(sql, [name, email, orderId, issueType, details], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ status: "Error", message: "Failed to save ticket" });
    }
    return res.json({ status: "Success", message: "Ticket saved successfully!" });
  });
});

// --- 6. OTHER APP ROUTES ---
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/products/:productId/reviews', reviewRoutes);
app.use('/api/checkout', checkoutRoutes);

// --- 7. HEALTH CHECK ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// --- 8. 404 HANDLER (MUST BE LAST) ---
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// --- SERVER START ---
app.listen(port, () => {
  console.log(`Backend API listening on http://localhost:${port}`);
});