import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../Config/Api';

const ProductModal = ({ isOpen, onClose, onSave, product }) => {
  const [form, setForm] = useState(product || { 
    name: '', 
    price: '', 
    description: '', 
    stock: '', 
    category_id: '', 
    seller_id: 1, 
    image_url: '' 
  });
  useEffect(() => {
    if (product) {
      setForm(product); 
    } else {
      // Agar naya product add kar rahe hain, to form khali kar dein
      setForm({ name: '', price: '', description: '', stock: '', category_id: '', seller_id: 1, image_url: '' });
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (product) {
        // Edit Mode: PUT request
        await axios.put(`${API_BASE_URL}/api/products/${product.id}`, form);
        toast.success("Product updated successfully!");
      } else {
        // Add Mode: POST request
        await axios.post(`${API_BASE_URL}/api/products`, form);
        toast.success("Product added successfully!");
      }
      onSave(); // Parent (Products.jsx) ko refresh karne ke liye
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save product. Check console logs.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm shadow-xl">
        <h2 className="text-xl font-bold mb-4">{product ? "Edit Product" : "Add Product"}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input className="w-full border p-2 rounded" placeholder="Product Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
          <input className="w-full border p-2 rounded" type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} required />
          <input className="w-full border p-2 rounded" placeholder="Description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
          <input className="w-full border p-2 rounded" type="number" placeholder="Stock Quantity" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} required />
          <input className="w-full border p-2 rounded" type="number" placeholder="Category ID" value={form.category_id} onChange={(e) => setForm({...form, category_id: e.target.value})} required />
          
          <div className="flex gap-2 pt-2">
            <button type="submit" className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;