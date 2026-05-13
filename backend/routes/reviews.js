const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router({ mergeParams: true });
const reviewsPath = path.join(__dirname, '../data/reviews.json');

function loadReviews() {
  try {
    const raw = fs.readFileSync(reviewsPath, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    return { reviews: {} };
  }
}

function saveReviews(data) {
  fs.writeFileSync(reviewsPath, JSON.stringify(data, null, 2));
}

router.get('/', (req, res) => {
  const productId = String(req.params.productId);
  const data = loadReviews();
  const productReviews = data.reviews[productId] || [];
  res.json({ productId, reviews: productReviews });
});

router.post('/', (req, res) => {
  const productId = String(req.params.productId);
  const { reviewerName, comment, rating } = req.body;

  if (!reviewerName || !comment || !rating) {
    return res.status(400).json({ error: 'reviewerName, comment, and rating are required' });
  }

  const newReview = {
    reviewerName,
    comment,
    rating: Number(rating),
    date: new Date().toISOString()
  };

  const data = loadReviews();
  data.reviews[productId] = data.reviews[productId] || [];
  data.reviews[productId].push(newReview);
  saveReviews(data);

  res.status(201).json({ message: 'Review created', review: newReview });
});

module.exports = router;
