import React from 'react';

const Users = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
      <ul className="bg-white border rounded p-4">
        <li className="py-2 border-b">User 1: Ahmed</li>
        <li className="py-2 border-b">User 2: Sara</li>
        <li className="py-2">User 3: Ali</li>
      </ul>
    </div>
  );
};
export default Users;