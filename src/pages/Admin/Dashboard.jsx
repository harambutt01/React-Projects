import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { API_BASE_URL } from '../../Config/Api';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalUsers: 0 });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Stats aur Sales Trend dono fetch karein
    axios.get(`${API_BASE_URL}/api/admin/stats`).then(res => setStats(res.data));
    axios.get(`${API_BASE_URL}/api/admin/sales-trend`).then(res => setChartData(res.data));
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
      
      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Revenue" value={`$${stats.totalRevenue}`} color="text-blue-600" />
        <StatCard title="Total Users" value={stats.totalUsers} color="text-green-600" />
        <StatCard title="Total Orders" value={stats.totalOrders} color="text-yellow-600" />
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-700 mb-6">Sales Trends (Monthly)</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Reusable Card Component
const StatCard = ({ title, value, color }) => (
  <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">{title}</h3>
    <p className={`text-3xl font-black mt-2 ${color}`}>{value}</p>
  </div>
);

export default Dashboard;