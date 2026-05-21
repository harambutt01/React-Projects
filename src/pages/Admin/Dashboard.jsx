import React from 'react';

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-blue-500 text-white rounded-lg shadow">Total Sales: $5,000</div>
        <div className="p-6 bg-green-500 text-white rounded-lg shadow">Total Users: 150</div>
        <div className="p-6 bg-yellow-500 text-white rounded-lg shadow">Total Orders: 45</div>
      </div>
    </div>
  );
};
export default Dashboard;