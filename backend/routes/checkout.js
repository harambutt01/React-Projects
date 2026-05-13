const express = require('express');
const db = require('../db');
const router = express.Router();

router.post('/', async (req, res) => {
  const { cartItems, shipping, paymentMethod } = req.body;

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
    const productIds = cartItems.map((item) => item.productId);
    const [products] = await db.query('SELECT id, price FROM products WHERE id IN (?)', [productIds]);
    const productMap = new Map(products.map((product) => [product.id, product]));

    let totalAmount = 0;
    for (const item of cartItems) {
      const product = productMap.get(item.productId);
      if (!product) {
        return res.status(400).json({ error: `Product not found: ${item.productId}` });
      }
      totalAmount += Number(product.price) * Number(item.quantity || 0);
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    const customerName = shipping.name;
    const customerEmail = shipping.email || null;
    const [customerResult] = await connection.query(
      'INSERT INTO customers (name, email) VALUES (?, ?)',
      [customerName, customerEmail]
    );

    const customerId = customerResult.insertId;
    const [orderResult] = await connection.query(
      'INSERT INTO shopping_orders (customer_id, total_amount) VALUES (?, ?)',
      [customerId, totalAmount]
    );

    const orderId = orderResult.insertId;
    await connection.query(
      'INSERT INTO payments (order_id, payment_method, status) VALUES (?, ?, ?)',
      [orderId, paymentMethod, 'Pending']
    );
    await connection.query(
      'INSERT INTO deliveries (order_id, delivery_status, tracking_number) VALUES (?, ?, ?)',
      [orderId, 'Pending', null]
    );
    await connection.query(
      'INSERT INTO transaction_reports (order_id, report_date, total_revenue) VALUES (?, CURRENT_DATE(), ?)',
      [orderId, totalAmount]
    );

    await connection.commit();
    res.json({ message: 'Order placed successfully', orderId: String(orderId), totalAmount });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error(error);
    res.status(500).json({ error: 'Unable to complete checkout' });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

module.exports = router;
