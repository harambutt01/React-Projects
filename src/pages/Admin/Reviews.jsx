import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {  API_BASE_URL } from '../../Config/Api';


const Reviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/admin/reviews`)
      .then(res => setReviews(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Customer Reviews</h1>
      {reviews.map(r => (
        <div key={r.id} className="border-l-4 border-green-500 bg-green-50 p-4 mb-4 shadow-sm">
          <p className="font-bold">{r.reviewer_name} <span className="text-sm font-normal text-gray-500">on {r.product_name}</span></p>
          <p className="text-gray-700 italic">"{r.comment}"</p>
          <p className="text-yellow-600 font-semibold">Rating: {r.rating} stars</p>
        </div>
      ))}
    </div>
  );
};
export default Reviews;