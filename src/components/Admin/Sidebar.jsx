import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  // Navigation Links ka array
  const navLinks = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Products', path: '/admin/products' },
    { name: 'Users', path: '/admin/users' },
    { name: 'Orders', path: '/admin/orders' },
    { name: 'Transactions', path: '/admin/transactions' },
    { name: 'Complaints', path: '/admin/complaints' },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-5">
      <h2 className="text-2xl font-bold mb-8 text-blue-400 border-b border-gray-700 pb-4">
        Admin Panel
      </h2>
      
      <nav>
        <ul className="space-y-2">
          {navLinks.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                end={link.name === 'Dashboard'} // Dashboard sirf home par active ho
                className={({ isActive }) =>
                  `block py-3 px-4 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;