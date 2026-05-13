const express = require('express');
const fs = require('fs');
const path = require('path');
const db = require('../db');
const router = express.Router();

const cartPath = path.join(__dirname, '../data/cart.json');

function loadCart() {
  try {
    const raw = fs.readFileSync(cartPath, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    return { items: [] };
  }
}

function saveCart(cart) {
  fs.writeFileSync(cartPath, JSON.stringify(cart, null, 2));
}

function buildCartItem(product, quantity) {
  return {
    productId: product.id,
    title: product.name,
    price: Number(product.price),
    quantity,
    thumbnail: null,
    total: Number((product.price * quantity).toFixed(2))
  };
}

router.get('/', async (req, res) => {
  const cart = loadCart();
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.items.reduce((sum, item) => sum + item.total, 0);
  res.json({ items: cart.items, totalItems, totalPrice });
});

router.post('/', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) {
      return res.status(400).json({ error: 'productId is required' });
    }

    const [rows] = await db.query('SELECT id, name, price FROM products WHERE id = ?', [productId]);
    if (!rows.length) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = rows[0];
    const cart = loadCart();
    const existing = cart.items.find((item) => item.productId === product.id);

    if (existing) {
      existing.quantity += quantity;
      existing.total = Number((existing.price * existing.quantity).toFixed(2));
      saveCart(cart);
      return res.json({ message: 'Cart updated', cartItem: existing });
    }

    const cartItem = buildCartItem(product, quantity);
    cart.items.push(cartItem);
    saveCart(cart);
    res.status(201).json({ message: 'Item added to cart', cartItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to update cart' });
  }
});

router.put('/:productId', async (req, res) => {
  try {
    const productId = Number(req.params.productId);
    const { quantity } = req.body;

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be a positive integer' });
    }

    const cart = loadCart();
    const item = cart.items.find((entry) => entry.productId === productId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    item.quantity = quantity;
    item.total = Number((item.price * quantity).toFixed(2));
    saveCart(cart);
    res.json({ message: 'Cart updated', cartItem: item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to update cart' });
  }
});

router.delete('/:productId', (req, res) => {
  const productId = Number(req.params.productId);
  const cart = loadCart();
  const index = cart.items.findIndex((item) => item.productId === productId);

  if (index === -1) {
    return res.status(404).json({ error: 'Item not found in cart' });
  }

  cart.items.splice(index, 1);
  saveCart(cart);
  res.json({ message: 'Item removed from cart' });
});

module.exports = router;
