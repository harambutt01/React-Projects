# Backend API Documentation

## Overview
This backend API supports the product catalog, product details, cart operations, product reviews, and checkout flows for the `my-app` frontend.

Base URL example:
- http://localhost:4000/api

---

## 1. Products

### 1.1 GET /api/products
Fetch the full product catalog with optional search, category, and sort filters.

Query parameters:
- `search` (optional) - text filter on product title
- `category` (optional) - exact category filter
- `sort` (optional) - `asc` or `desc` (sort by price)
- `page` (optional) - page number, default `1`
- `pageSize` (optional) - items per page, default `20`

Response:
```json
{
  "products": [
    {
      "id": 1,
      "title": "iPhone 9",
      "description": "An apple mobile which is nothing like apple",
      "price": 549,
      "discountPercentage": 12.96,
      "rating": 4.69,
      "stock": 94,
      "brand": "Apple",
      "category": "smartphones",
      "thumbnail": "https://...",
      "images": ["https://...", "https://..."]
    }
  ],
  "total": 100,
  "page": 1,
  "pageSize": 20,
  "categories": ["smartphones", "laptops", "fragrances"]
}
```

cURL:
```bash
curl -X GET "http://localhost:4000/api/products?search=watch&category=smartphones&sort=asc&page=1&pageSize=20"
```

---

### 1.2 GET /api/products/:id
Fetch the product detail for a specific product ID.

Path parameter:
- `id` - product ID

Response:
```json
{
  "id": 1,
  "title": "iPhone 9",
  "description": "An apple mobile which is nothing like apple",
  "price": 549,
  "discountPercentage": 12.96,
  "rating": 4.69,
  "stock": 94,
  "brand": "Apple",
  "category": "smartphones",
  "thumbnail": "https://...",
  "images": ["https://...", "https://..."],
  "reviews": [
    {
      "reviewerName": "Sofia",
      "comment": "Great phone",
      "rating": 5,
      "date": "2026-05-08T12:00:00.000Z"
    }
  ]
}
```

cURL:
```bash
curl -X GET "http://localhost:4000/api/products/1"
```

---

### 1.3 GET /api/categories
Retrieve the list of available product categories.

Response:
```json
{
  "categories": ["smartphones", "laptops", "fragrances", "skincare"]
}
```

cURL:
```bash
curl -X GET "http://localhost:4000/api/categories"
```

---

## 2. Product Reviews

### 2.1 GET /api/products/:id/reviews
Get stored reviews for a product.

Path parameter:
- `id` - product ID

Response:
```json
{
  "productId": 1,
  "reviews": [
    {
      "reviewerName": "Sofia",
      "comment": "Great phone",
      "rating": 5,
      "date": "2026-05-08T12:00:00.000Z"
    }
  ]
}
```

cURL:
```bash
curl -X GET "http://localhost:4000/api/products/1/reviews"
```

---

### 2.2 POST /api/products/:id/reviews
Submit a new review for a product.

Path parameter:
- `id` - product ID

Request body:
```json
{
  "reviewerName": "Sofia",
  "comment": "Amazing build quality and performance.",
  "rating": 5
}
```

Response:
```json
{
  "message": "Review created",
  "review": {
    "reviewerName": "Sofia",
    "comment": "Amazing build quality and performance.",
    "rating": 5,
    "date": "2026-05-08T12:00:00.000Z"
  }
}
```

cURL:
```bash
curl -X POST "http://localhost:4000/api/products/1/reviews" \
  -H "Content-Type: application/json" \
  -d '{"reviewerName":"Sofia","comment":"Amazing build quality and performance.","rating":5}'
```

---

## 3. Cart Operations
These endpoints support cart storage and updates for a shopping session.

### 3.1 GET /api/cart
Read the current cart contents.

Response:
```json
{
  "items": [
    {
      "productId": 1,
      "title": "iPhone 9",
      "price": 549,
      "quantity": 2,
      "thumbnail": "https://...",
      "total": 1098
    }
  ],
  "totalItems": 2,
  "totalPrice": 1098
}
```

cURL:
```bash
curl -X GET "http://localhost:4000/api/cart"
```

---

### 3.2 POST /api/cart
Add a product to the cart or create the cart if it does not exist.

Request body:
```json
{
  "productId": 1,
  "quantity": 1
}
```

Response:
```json
{
  "message": "Item added to cart",
  "cartItem": {
    "productId": 1,
    "quantity": 1,
    "total": 549
  }
}
```

cURL:
```bash
curl -X POST "http://localhost:4000/api/cart" \
  -H "Content-Type: application/json" \
  -d '{"productId":1,"quantity":1}'
```

---

### 3.3 PUT /api/cart/:productId
Update quantity for a cart product.

Path parameter:
- `productId` - product ID

Request body:
```json
{
  "quantity": 3
}
```

Response:
```json
{
  "message": "Cart updated",
  "cartItem": {
    "productId": 1,
    "quantity": 3,
    "total": 1647
  }
}
```

cURL:
```bash
curl -X PUT "http://localhost:4000/api/cart/1" \
  -H "Content-Type: application/json" \
  -d '{"quantity":3}'
```

---

### 3.4 DELETE /api/cart/:productId
Remove a product from the cart.

Response:
```json
{
  "message": "Item removed from cart"
}
```

cURL:
```bash
curl -X DELETE "http://localhost:4000/api/cart/1"
```

---

## 4. Checkout

### 4.1 POST /api/checkout
Submit the cart for order processing.

Request body:
```json
{
  "cartItems": [
    { "productId": 1, "quantity": 2 },
    { "productId": 4, "quantity": 1 }
  ],
  "shipping": {
    "name": "Sofia Patel",
    "address": "123 Main St",
    "city": "Austin",
    "postalCode": "78701",
    "country": "USA"
  },
  "paymentMethod": "card"
}
```

Response:
```json
{
  "message": "Order placed successfully",
  "orderId": "order_12345",
  "totalAmount": 2197
}
```

cURL:
```bash
curl -X POST "http://localhost:4000/api/checkout" \
  -H "Content-Type: application/json" \
  -d '{"cartItems":[{"productId":1,"quantity":2},{"productId":4,"quantity":1}],"shipping":{"name":"Sofia Patel","address":"123 Main St","city":"Austin","postalCode":"78701","country":"USA"},"paymentMethod":"card"}'
```

---

## 5. Notes and Implementation Guidance
- The frontend currently fetches product data from `https://dummyjson.com/products?limit=0`.
- The backend API should replace this external data source so the app can call `/api/products` and `/api/products/:id` instead.
- Product reviews are currently stored in localStorage in the frontend. The backend review endpoints enable shared review persistence.
- Cart operations are currently local only. The backend cart endpoints provide a central cart experience for server-backed sessions or authenticated users.

## 6. Recommended Backend Structure
- `backend/server.js` or `backend/index.js`
- `backend/routes/products.js`
- `backend/routes/cart.js`
- `backend/routes/reviews.js`
- `backend/routes/checkout.js`
- `backend/data/products.json`

## 7. Required Functionalities Summary
1. Product list with search / filter / sort / pagination
2. Product detail by ID
3. Category list
4. Product review retrieval and creation
5. Cart retrieval, add, update quantity, remove
6. Checkout submission

---

## 8. Example Base URL
If using Express on port 4000:
- `http://localhost:4000/api/products`
- `http://localhost:4000/api/products/1`
- `http://localhost:4000/api/cart`
- `http://localhost:4000/api/products/1/reviews`
- `http://localhost:4000/api/checkout`

