import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi'; 

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  const navLinks = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Products', path: '/admin/products' },
    { name: 'Users', path: '/admin/users' },
    { name: 'Orders', path: '/admin/orders' },
    { name: 'Transactions', path: '/admin/transactions' },
    { name: 'Complaints', path: '/admin/complaints' },
  ];

  return (
<div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 p-5 flex flex-col shadow-xl z-50">
        <h2 className="text-2xl font-bold mb-8 text-blue-400 border-b border-gray-700 pb-4">
        Admin Panel
      </h2>
      
      <nav className="flex-grow">
        <ul className="space-y-2">
          {navLinks.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                end={link.name === 'Dashboard'}
                className={({ isActive }) =>
                  `block py-3 px-4 rounded-lg transition-all duration-300 ease-in-out ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
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

      <button 
        onClick={handleLogout}
        className="mt-auto py-3 px-4 bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium border border-gray-700 hover:border-red-600"
      >
        <FiLogOut size={18} />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;