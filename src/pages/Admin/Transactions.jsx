import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {  API_BASE_URL } from '../../Config/Api';


const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/admin/transactions`)
      .then(res => setTransactions(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Transactions History</h1>
      <table className="min-w-full bg-white border rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Product</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Revenue</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(t => (
            <tr key={t.id} className="text-center">
              <td className="p-2 border">{new Date(t.report_date).toLocaleDateString()}</td>
              <td className="p-2 border">{t.product_name}</td>
              <td className="p-2 border">{t.category}</td>
              <td className="p-2 border">${t.total_revenue}</td>
              <td className="p-2 border font-bold text-yellow-600">{t.payment_status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Transactions;