import React from 'react';

const Products = () => {
  // Mock data - jab aap API connect karein, toh yahan useState use karke data set karein
  const products = [
    { id: 1, name: 'Laptop', category: 'Electronics', stock: 10, status: 'In Stock', price: '$800' },
    { id: 2, name: 'Shoes', category: 'Fashion', stock: 5, status: 'Low Stock', price: '$50' },
    { id: 3, name: 'Headphones', category: 'Electronics', stock: 0, status: 'Out of Stock', price: '$100' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Products</h1>
      
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Product Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{item.id}</td>
                <td className="py-3 px-4 font-medium">{item.name}</td>
                <td className="py-3 px-4">{item.category}</td>
                <td className="py-3 px-4">{item.stock}</td>
                <td className={`py-3 px-4 font-semibold ${
                  item.status === 'In Stock' ? 'text-green-600' : 
                  item.status === 'Low Stock' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {item.status}
                </td>
                <td className="py-3 px-4">{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;