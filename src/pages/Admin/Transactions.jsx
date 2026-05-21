import React from 'react';

const Transactions = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Transactions History</h1>
      <div className="bg-white p-4 border rounded">
        <p className="text-gray-600">Last Transaction: 21 May 2026 - $450 (Success)</p>
        <p className="text-gray-600">Previous: 20 May 2026 - $120 (Success)</p>
      </div>
    </div>
  );
};
export default Transactions;