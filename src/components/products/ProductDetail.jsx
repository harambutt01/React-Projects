import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../ThemeContext";
import { useCart } from "../CartContext";
import productsData from "./Products.json";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { addToCart } = useCart();

  const product = productsData.find((p) => p.id === parseInt(id));

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details");

  if (!product) {
    return (
      <div className="text-center mt-[80px]">
        <p className={isDark ? "text-white" : "text-black"}>Product not found.</p>
        <button onClick={() => navigate("/products")}
          className="mt-[16px] px-[16px] py-[8px] bg-black text-white rounded">
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className={`max-w-[800px] mx-auto mt-[24px] p-[24px] rounded-[12px]
      ${isDark ? "bg-[#1e1e1e] text-white" : "bg-white text-black"}`}>

      {/* Back Button */}
      <button
        onClick={() => navigate("/products")}
        className="mb-[16px] text-sm text-[#4f6ef7] hover:underline cursor-pointer bg-transparent border-none">
        ← Back to Products
      </button>

      {/* Product Image */}
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-[300px] object-cover rounded-xl mb-[24px]"
      />

      {/* Category */}
      <p className={`text-sm uppercase font-bold tracking-widest mb-[4px]
        ${isDark ? "text-[#888]" : "text-[#999]"}`}>
        {product.category}
      </p>

      {/* Name */}
      <h1 className="text-2xl font-bold mb-[8px]">{product.name}</h1>

      {/* Price */}
      <p className="text-[24px] font-bold text-[#4f6ef7] mb-[16px]">
        ${product.price.toFixed(2)}
      </p>

      {/* Quantity Selector */}
      <div className="flex items-center gap-[12px] mb-[16px]">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className={`w-[32px] h-[32px] rounded border text-lg font-bold cursor-pointer
            ${isDark ? "border-[#555] bg-[#2a2a2a] text-white" : "border-[#ddd] bg-[#f5f5f5] text-black"}`}>
          -
        </button>
        <span className="text-lg font-semibold">{quantity}</span>
        <button
          onClick={() => setQuantity((q) => q + 1)}
          className={`w-[32px] h-[32px] rounded border text-lg font-bold cursor-pointer
            ${isDark ? "border-[#555] bg-[#2a2a2a] text-white" : "border-[#ddd] bg-[#f5f5f5] text-black"}`}>
          +
        </button>
      </div>

      {/* Add to Cart & Buy Now */}
      <div className="flex gap-[12px] mb-[24px]">
        <button
          onClick={() => addToCart(product, quantity)}
          className={`flex-1 py-[10px] rounded border font-semibold cursor-pointer transition-colors duration-200
            ${isDark ? "border-[#555] text-white hover:bg-[#2a2a2a]" : "border-[#ddd] text-black hover:bg-[#f5f5f5]"}`}>
          Add to Cart
        </button>
        <button className="flex-1 py-[10px] rounded bg-black text-white font-semibold cursor-pointer hover:bg-[#333] transition-colors duration-200">
          Buy it Now
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-[16px] border-b mb-[16px]">
        <button
          onClick={() => setActiveTab("details")}
          className={`pb-[8px] font-semibold cursor-pointer border-b-2 transition-colors duration-200 bg-transparent
            ${activeTab === "details"
              ? "border-[#4f6ef7] text-[#4f6ef7]"
              : "border-transparent text-[#999]"}`}>
          Details
        </button>
        <button
          onClick={() => setActiveTab("description")}
          className={`pb-[8px] font-semibold cursor-pointer border-b-2 transition-colors duration-200 bg-transparent
            ${activeTab === "description"
              ? "border-[#4f6ef7] text-[#4f6ef7]"
              : "border-transparent text-[#999]"}`}>
          Description
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "details" ? (
        <div className={`text-sm leading-[24px] ${isDark ? "text-[#aaa]" : "text-[#555]"}`}>
          <p><span className="font-semibold">Name:</span> {product.name}</p>
          <p><span className="font-semibold">Category:</span> {product.category}</p>
          <p><span className="font-semibold">Price:</span> ${product.price.toFixed(2)}</p>
        </div>
      ) : (
        <p className={`text-sm leading-[24px] ${isDark ? "text-[#aaa]" : "text-[#555]"}`}>
          {product.description}
        </p>
      )}

    </div>
  );
}

export default ProductDetail;