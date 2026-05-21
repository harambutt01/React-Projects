import React from 'react';

const Orders = () => {
  const orders = [
    { id: '#101', customer: 'Ali', status: 'Pending', total: '$120' },
    { id: '#102', customer: 'Sara', status: 'Shipped', total: '$85' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Orders</h1>
      <table className="min-w-full bg-white border rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Order ID</th>
            <th className="p-2 border">Customer</th>
           <th className="p-2 border">Product</th>
            <th className="p-2 border">Category</th>
           <th className="p-2 border">Status</th>
           <th className="p-2 border">Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td className="p-2 border text-center">{o.id}</td>
              <td className="p-2 border text-center">{o.customer}</td>
              <td className="p-2 border text-center text-blue-600">{o.status}</td>
              <td className="p-2 border text-center">{o.product}</td>
              <td className="p-2 border text-center">{o.category}</td>
              <td className="p-2 border text-center">{o.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Orders;