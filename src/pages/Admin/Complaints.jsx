import React from 'react';

const Complaints = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Customer Complaints</h1>
      <div className="space-y-4">
        <div className="p-4 border-l-4 border-red-500 bg-red-50">
          <p className="font-semibold">User: Ahmed</p>
          <p>Issue: Product late delivery.</p>
        </div>
        <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
          <p className="font-semibold">User: Zoya</p>
          <p>Issue: Size mismatch.</p>
        </div>
      </div>
    </div>
  );
};
export default Complaints;