const express = require('express');
const db = require('../db');
const router = express.Router();

router.post('/', async (req, res) => {
  // 🟢 Frontend se bhejha hua paymentStatus yahan req.body se receive kiya
  const { cartItems, shipping, paymentMethod, user_id, paymentStatus } = req.body;

  // Standard checks
  if (!Array.isArray(cartItems) || !cartItems.length) {
    return res.status(400).json({ error: 'cartItems is required and must be a non-empty array' });
  }
  if (!shipping || !shipping.name || !shipping.address || !shipping.city || !shipping.postalCode || !shipping.country) {
    return res.status(400).json({ error: 'Complete shipping details are required' });
  }
  if (!paymentMethod) {
    return res.status(400).json({ error: 'paymentMethod is required' });
  }

  let connection;

  try {
    const productIds = cartItems.map((item) => item.product_id || item.productId);
    
    const activeUserId = user_id || cartItems[0].user_id || cartItems[0].userId || 2; 

    const [cartRecords] = await db.query(
      'SELECT product_id, category, price, quantity FROM cart WHERE user_id = ? AND product_id IN (?)',
      [activeUserId, productIds]
    );

    const cartMap = new Map(cartRecords.map((item) => [item.product_id, item]));

    const [products] = await db.query('SELECT id, price FROM products WHERE id IN (?)', [productIds]);
    const productMap = new Map(products.map((product) => [product.id, product]));

    let totalAmount = 0;
    for (const item of cartItems) {
      const currentProductId = item.product_id || item.productId;
      const cartItem = cartMap.get(currentProductId);
      const productItem = productMap.get(currentProductId);
      
      if (!cartItem && !productItem) {
        return res.status(400).json({ error: `Product not found in cart or catalog: ${currentProductId}` });
      }

      const itemPrice = cartItem ? cartItem.price : productItem.price;
      const itemQty = cartItem ? cartItem.quantity : (item.quantity || 1);
      totalAmount += Number(itemPrice) * Number(itemQty);
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    // Customer setup
    const customerName = shipping.name;
    const customerEmail = shipping.email || null;
    let customerId;

    if (customerEmail) {
      const [existingCustomer] = await connection.query(
        'SELECT id FROM customers WHERE email = ?',
        [customerEmail]
      );
      if (existingCustomer.length > 0) {
        customerId = existingCustomer[0].id;
      }
    }

    if (!customerId) {
      const [customerResult] = await connection.query(
        'INSERT INTO customers (name, email) VALUES (?, ?)',
        [customerName, customerEmail]
      );
      customerId = customerResult.insertId;
    }

    // Insert order
       const [orderResult] = await connection.query(
  'INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)',
  [activeUserId, totalAmount, 'pending']
);

    const orderId = orderResult.insertId;

    // 🟢 Agar online payment se 'Paid' aaya hai toh payments table mein bhi update ho jaye
    const currentPaymentStatus = paymentStatus || 'Pending';

    await connection.query(
      'INSERT INTO payments (order_id, payment_method, status) VALUES (?, ?, ?)',
      [orderId, paymentMethod, currentPaymentStatus]
    );

    await connection.query(
      'INSERT INTO deliveries (order_id, delivery_status, tracking_number) VALUES (?, ?, ?)',
      [orderId, 'Pending', null]
    );

    for (const item of cartItems) {
      const currentProductId = item.product_id || item.productId;
      const cartItem = cartMap.get(currentProductId);
      const productItem = productMap.get(currentProductId);

      const currentCategory = (cartItem && cartItem.category) || item.category || item.Category || 'General';
      const currentQuantity = cartItem ? cartItem.quantity : Number(item.quantity || 1);
      const currentPrice = cartItem ? cartItem.price : (productItem ? productItem.price : Number(item.price || 0));
      const itemTotalRevenue = Number(currentPrice) * Number(currentQuantity);

      // 🟢 TRANSACTION_REPORTS QUERY UPDATED WITH PAYMENT_STATUS COLUMN
      await connection.query(
        `INSERT INTO transaction_reports (order_id, product_id, category, quantity, price, total_revenue, report_date, payment_status) 
         VALUES (?, ?, ?, ?, ?, ?, CURRENT_DATE(), ?)`,
        [orderId, currentProductId, currentCategory, currentQuantity, currentPrice, itemTotalRevenue, currentPaymentStatus]
      );
    }

    await connection.query(
      'DELETE FROM cart WHERE user_id = ? AND product_id IN (?)',
      [activeUserId, productIds]
    );

    await connection.commit();
    res.json({ message: 'Order placed successfully', orderId: String(orderId), totalAmount });

  } catch (error) {
    if (connection) {
      await connection.rollback(); 
    }
    console.error("Final Checkout Fix Crash:", error);
    res.status(500).json({ error: 'Unable to complete checkout' });
  } finally {
    if (connection) {
      connection.release(); 
    }
  }
});

module.exports = router;