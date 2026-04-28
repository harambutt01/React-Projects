import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../ThemeContext";
import productsData from "./Products.json";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const product = productsData.find((p) => p.id === parseInt(id));

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details");

  if (!product) {
    return (
      <div className="text-center mt-20">
        <p className={isDark ? "text-white" : "text-black"}>Product not found.</p>
        <button onClick={() => navigate("/products")}
          className="mt-4 px-4 py-2 bg-black text-white rounded">
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className={`max-w-[800px] mx-auto mt-2 p-6 rounded-xl
      ${isDark ? "bg-[#1e1e1e] text-white" : "bg-white text-black"}`}>

      {/* Back Button */}
      <button
        onClick={() => navigate("/products")}
        className="mb-4 text-sm text-[#4f6ef7] hover:underline cursor-pointer bg-transparent border-none">
        ← Back to Products
      </button>

      {/* Product Image */}
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-[300px] object-cover rounded-xl mb-6"
      />

      {/* Product Name & Category */}
      <p className={`text-sm uppercase font-bold tracking-widest mb-1
        ${isDark ? "text-[#888]" : "text-[#999]"}`}>
        {product.category}
      </p>
      <h1 className="text-2xl font-bold mb-2">{product.name}</h1>

      {/* Price */}
      <p className="text-[1.5rem] font-bold text-[#4f6ef7] mb-4">
        ${product.price.toFixed(2)}
      </p>

      {/* Quantity Selector */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className={`w-8 h-8 rounded border text-lg font-bold cursor-pointer
            ${isDark ? "border-[#555] bg-[#2a2a2a] text-white" : "border-[#ddd] bg-[#f5f5f5] text-black"}`}>
          -
        </button>
        <span className="text-lg font-semibold">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => q + 1)}
          className={`w-8 h-8 rounded border text-lg font-bold cursor-pointer
            ${isDark ? "border-[#555] bg-[#2a2a2a] text-white" : "border-[#ddd] bg-[#f5f5f5] text-black"}`}>
          +
        </button>
      </div>

      {/* Add to Cart & Buy Now */}
      <div className="flex gap-3 mb-6">
        <button className={`flex-1 py-2.5 rounded border font-semibold cursor-pointer transition-colors duration-200
          ${isDark ? "border-[#555] text-white hover:bg-[#2a2a2a]" : "border-[#ddd] text-black hover:bg-[#f5f5f5]"}`}>
          Add to Cart
        </button>
        <button className="flex-1 py-2.5 rounded bg-black text-white font-semibold cursor-pointer hover:bg-[#333] transition-colors duration-200">
          Buy it Now
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-4">
        <button
          onClick={() => setActiveTab("details")}
          className={`pb-2 font-semibold cursor-pointer border-b-2 transition-colors duration-200 bg-transparent
            ${activeTab === "details"
              ? "border-black text-black"
              : "border-transparent text-[#999]"}`}>
          Details
        </button>
        <button
          onClick={() => setActiveTab("description")}
          className={`pb-2 font-semibold cursor-pointer border-b-2 transition-colors duration-200 bg-transparent
            ${activeTab === "description"
              ? "border-black text-black"
              : "border-transparent text-[#999]"}`}>
          Description
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "details" ? (
        <div className={`text-sm leading-6 ${isDark ? "text-[#aaa]" : "text-[#555]"}`}>
          <p><span className="font-semibold">Name:</span> {product.name}</p>
          <p><span className="font-semibold">Category:</span> {product.category}</p>
          <p><span className="font-semibold">Price:</span> ${product.price.toFixed(2)}</p>
        </div>
      ) : (
        <p className={`text-sm leading-6 ${isDark ? "text-[#aaa]" : "text-[#555]"}`}>
          {product.description}
        </p>
      )}

    </div>
  );
}

export default ProductDetail;