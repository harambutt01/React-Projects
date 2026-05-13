const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2');

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// --- MIDDLEWARE ---
app.use(cors()); // Ye frontend (3000) aur backend (4000) ko connect karne ke liye zaroori hai
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- DATABASE CONNECTION ---
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

// --- ROUTES IMPORT ---
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const cartRoutes = require('./routes/cart');
const reviewRoutes = require('./routes/reviews');
const checkoutRoutes = require('./routes/checkout');

// --- AUTHENTICATION APIs (Signup & Login) ---

// 1. SIGNUP API - English Messages Updated
app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;

  // Pehle check karein ke email pehle se toh nahi hai
  const checkSql = "SELECT * FROM users WHERE email = ?";
  db.query(checkSql, [email], (err, data) => {
    if (err) return res.status(500).json({ status: "Error", message: "Database connection error" });
    
    if (data.length > 0) {
      // Professional English Error
      return res.status(400).json({ status: "Error", message: "Email is already registered!" });
    }

    // Naya user insert karein
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [name, email, password], (err, result) => {
      if (err) return res.status(500).json({ status: "Error", message: "Registration failed. Try again!" });
      return res.json({ status: "Success", message: "Account created successfully!" });
    });
  });
});

// 2. LOGIN API - English Messages Updated
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
      // Professional English Error for wrong credentials
      return res.status(401).json({ status: "Error", message: "Invalid Email or Password!" });
    }
  });
});

// --- OTHER APP ROUTES ---
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/products/:productId/reviews', reviewRoutes);
app.use('/api/checkout', checkoutRoutes);

// --- HEALTH CHECK & 404 ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend API is running perfectly' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// --- SERVER START ---
app.listen(port, () => {
  console.log(`Backend API listening on http://localhost:${port}`);
});