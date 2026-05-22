import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi'; 
import { API_BASE_URL } from '../../Config/Api';
import ProductModal from '../../components/Admin/ProductModal'; 

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products`);
      setProducts(response.data.products || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Failed to fetch products.");
    }
  };

const confirmDelete = async () => {
    if (!productToDelete) return;
  
    try {
      // 1. Backend API call
      await axios.delete(`${API_BASE_URL}/api/products/${productToDelete.id}`);
  
      // 2. Success Toast
      toast.success("Product deleted successfully!");
  
      // 3. UI Update (List se remove karein)
      setProducts((prevProducts) => prevProducts.filter((p) => p.id !== productToDelete.id));
  
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete product.");
    } finally {
      // 4. Modal Hamesha band hoga (chahe success ho ya error)
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };
  if (loading) return <div className="p-6">Loading products...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <button 
          onClick={() => { setCurrentProduct(null); setShowModal(true); }} 
          className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700 transition"
        >
          <FiPlus /> Add Product
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-3 px-4">Product Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 border">{p.name}</td>
                <td className="py-3 px-4 border">{p.category}</td>
                <td className="py-3 px-4 border">${p.price}</td>
                <td className="py-3 px-4 border text-center">
                  <div className="flex justify-center gap-3">
                    <button 
                      onClick={() => { setCurrentProduct(p); setShowModal(true); }}
                      className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button 
                      onClick={() => { setProductToDelete(p); setShowDeleteModal(true); }}
                      className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm shadow-xl text-center">
            <h2 className="text-xl font-bold mb-4">Delete Product?</h2>
            <p className="mb-6">Are you sure you want to delete {productToDelete?.name}? This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button 
                type="button" 
                onClick={() => setShowDeleteModal(false)} 
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={confirmDelete} 
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Add/Edit Modal */}
      {showModal && (
        <ProductModal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
          onSave={() => { fetchProducts(); setShowModal(false); }} 
          product={currentProduct} 
        />
      )}
    </div>
  );
};

export default Products;