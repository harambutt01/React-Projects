

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

// --- 2. STATIC ASSETS ---
app.use('/', express.static(path.join(__dirname, '../public')));
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

// --- 4. ROUTES IMPORT ---
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const cartRoutes = require('./routes/cart');
const reviewRoutes = require('./routes/reviews');
const checkoutRoutes = require('./routes/checkout');

// --- 5. AUTHENTICATION APIs ---
app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;
  const role = (email === 'harammeer02@gmail.com') ? 'admin' : 'user';

  const checkSql = "SELECT * FROM users WHERE email = ?";
  db.query(checkSql, [email], (err, data) => {
    if (err) return res.status(500).json({ status: "Error", message: "Database error" });
    if (data.length > 0) return res.status(400).json({ status: "Error", message: "Email already registered!" });

    const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, email, password, role], (err, result) => {
      if (err) return res.status(500).json({ status: "Error", message: "Registration failed" });
      return res.json({ status: "Success", message: "Account created with role: " + role });
    });
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT id, name, email, role FROM users WHERE email = ? AND password = ?";
  
  db.query(sql, [email, password], (err, data) => {
    if (err) return res.status(500).json({ status: "Error", message: "Internal server error" });
    if (data.length > 0) {
      const user = data[0]; 
      return res.json({ status: "Success", user });
    } else {
      return res.status(401).json({ status: "Error", message: "Invalid credentials" });
    }
  });
});
app.get('/api/admin/transactions', (req, res) => {
  const sql = `
    SELECT 
      s.id, 
      s.total_revenue, 
      s.payment_status, 
      s.report_date,
      p.name AS product_name,
      s.category
    FROM sales_report s
    JOIN products p ON s.product_id = p.id
    ORDER BY s.report_date DESC`;
    
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to fetch transactions" });
    res.json(data);
  });
});

app.get('/api/admin/reviews', (req, res) => {
  const sql = `
    SELECT 
      r.id, 
      r.reviewer_name, 
      r.comment, 
      r.rating, 
      r.created_at,
      p.name AS product_name 
    FROM reviews r
    JOIN products p ON r.product_id = p.id
    ORDER BY r.created_at DESC`;

  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to fetch reviews" });
    res.json(data);
  });
});

// --- 6. ADMIN APIs ---
app.get('/api/admin/stats', (req, res) => {
  const revenueSql = "SELECT SUM(total_price) AS totalRevenue FROM orders";
  const ordersSql = "SELECT COUNT(*) AS totalOrders FROM orders";
  const usersSql = "SELECT COUNT(*) AS totalUsers FROM users"; 

  db.query(revenueSql, (err, revData) => {
    db.query(ordersSql, (err, ordData) => {
      db.query(usersSql, (err, userData) => {
        res.json({
          totalRevenue: revData[0]?.totalRevenue || 0,
          totalOrders: ordData[0]?.totalOrders || 0,
          totalUsers: userData[0]?.totalUsers || 0
        });
      });
    });
  });
});

app.get('/api/admin/sales-trend', (req, res) => {
  const sql = `SELECT DATE_FORMAT(created_at, '%b') AS name, SUM(total_price) AS revenue 
               FROM orders GROUP BY MONTH(created_at) ORDER BY MONTH(created_at) ASC LIMIT 12`;
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ error: "Query Failed" });
    res.json(data);
  });
});

app.get('/api/admin/recent-orders', (req, res) => {
  const sql = `
    SELECT 
      o.id AS order_id, 
      u.name AS customer_name, 
      o.total_price, 
      o.status 
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.id DESC LIMIT 5`;
    
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to fetch orders" });
    res.json(data);
  });
});


// --- NEWLY ADDED: GET ALL USERS ---
app.get('/api/users', (req, res) => {
  const sql = "SELECT id, name, email, role FROM users";
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to fetch users" });
    res.json(data);
  });
});

// --- NEWLY ADDED: POST REVIEW ROUTE ---
app.post('/api/products/:productId/reviews', (req, res) => {
    const { productId } = req.params;
    const { reviewerName, comment, rating } = req.body;

    const sql = "INSERT INTO reviews (product_id, reviewer_name, comment, rating, created_at) VALUES (?, ?, ?, ?, NOW())";
    
    db.query(sql, [productId, reviewerName, comment, rating], (err, result) => {
        if (err) {
            console.error("Error saving review:", err);
            return res.status(500).json({ status: "Error", message: "Failed to save review" });
        }
        res.json({ status: "Success", message: "Review added successfully!" });
    });
});
// --- 7. OTHER ROUTES (Cleaned) ---
// Note: Manual app.post wala block yahan se hata dein taake conflict na ho

app.use('/api/products', productRoutes); 
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/reviews', reviewRoutes); 
app.use('/api/checkout', checkoutRoutes);

app.listen(port, () => console.log(`Backend running on http://localhost:${port}`));