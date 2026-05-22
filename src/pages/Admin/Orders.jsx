import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {  API_BASE_URL } from '../../Config/Api';


const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // API se real data fetch karein
    axios.get(`${API_BASE_URL}/api/admin/recent-orders`)
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Orders</h1>
      <table className="min-w-full bg-white border rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Order ID</th>
            <th className="p-2 border">Customer</th>
            <th className="p-2 border">Product</th> 
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.order_id}>
              <td className="p-2 border text-center">#{o.order_id}</td>
              <td className="p-2 border text-center">{o.customer_name}</td>
              <td className="p-2 border text-center">{o.product_name || 'N/A'}</td> 
              <td className="p-2 border text-center">{o.status}</td>
              <td className="p-2 border text-center">${o.total_price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;