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
    /* Updated: mt-[100px] ensures the error message isn't hidden by navbar */
    return (
      <div className="text-center mt-[100px] px-5">
        <p className={isDark ? "text-white" : "text-black text-lg"}>Product not found.</p>
        <button onClick={() => navigate("/products")}
          className="mt-[16px] px-[20px] py-[10px] bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
          Back to Products
        </button>
      </div>
    );
  }

  return (
    /* pt-24 (96px) handles the navbar gap. 
       max-w-6xl and mx-auto center the card nicely on large screens. */
    <div className={`pt-24 pb-12 px-5 min-h-screen ${isDark ? "bg-[#121212]" : "bg-gray-50"}`}>
      
      <div className={`mx-auto max-w-6xl p-[32px] rounded-[16px] shadow-sm border
        ${isDark ? "bg-[#1e1e1e] text-white border-[#333]" : "bg-white text-black border-gray-100"}`}>

        {/* Back Button */}
        <button
          onClick={() => navigate("/products")}
          className="text-sm font-medium text-[#4f6ef7] hover:text-blue-700 cursor-pointer bg-transparent border-none flex items-center gap-1 mb-[24px]">
          ← Back to Products
        </button>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] lg:gap-[80px]">

          {/* Left Side — Image + Interaction */}
          <div className="flex flex-col gap-[20px]">
            <div className="overflow-hidden rounded-2xl bg-white border border-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[400px] object-contain p-4 hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-[16px]">
              <span className="font-semibold text-sm">Quantity:</span>
              <div className="flex items-center gap-[12px]">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className={`w-[36px] h-[36px] rounded-full border flex items-center justify-center font-bold cursor-pointer transition-all
                    ${isDark ? "border-[#555] bg-[#2a2a2a] hover:bg-[#333]" : "border-[#ddd] bg-[#f5f5f5] hover:bg-gray-200"}`}>
                  -
                </button>
                <span className="text-lg font-bold min-w-[20px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className={`w-[36px] h-[36px] rounded-full border flex items-center justify-center font-bold cursor-pointer transition-all
                    ${isDark ? "border-[#555] bg-[#2a2a2a] hover:bg-[#333]" : "border-[#ddd] bg-[#f5f5f5] hover:bg-gray-200"}`}>
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart & Buy Now */}
            <div className="flex flex-col gap-[12px]">
              <button
                onClick={() => addToCart(product, quantity)}
                className={`w-full py-[14px] rounded-xl border font-bold cursor-pointer transition-all duration-200
                  ${isDark ? "border-[#555] text-white hover:bg-[#2a2a2a]" : "border-black text-black hover:bg-black hover:text-white"}`}>
                Add to Cart
              </button>
              <button className="w-full py-[14px] rounded-xl bg-blue-600 text-white font-bold cursor-pointer hover:bg-blue-700 shadow-md transition-all">
                Buy it Now
              </button>
            </div>
          </div>

          {/* Right Side — Product Info */}
          <div className="flex flex-col">
            <p className={`text-xs uppercase font-black tracking-[0.2em] mb-[8px]
              ${isDark ? "text-blue-400" : "text-blue-600"}`}>
              {product.category}
            </p>

            <h1 className="text-3xl md:text-4xl font-extrabold mb-[12px] tracking-tight">{product.name}</h1>

            <p className={`text-3xl font-bold mb-[24px] ${isDark ? "text-white" : "text-gray-900"}`}>
              ${product.price.toFixed(2)}
            </p>

            {/* Tabs */}
            <div className="flex gap-[24px] border-b border-gray-200 mb-[20px]">
              <button
                onClick={() => setActiveTab("details")}
                className={`pb-[12px] text-sm font-bold cursor-pointer border-b-2 transition-all bg-transparent
                  ${activeTab === "details"
                    ? (isDark ? "border-blue-400 text-blue-400" : "border-black text-black")
                    : "border-transparent text-gray-400 hover:text-gray-600"}`}>
                Details
              </button>
              <button
                onClick={() => setActiveTab("description")}
                className={`pb-[12px] text-sm font-bold cursor-pointer border-b-2 transition-all bg-transparent
                  ${activeTab === "description"
                    ? (isDark ? "border-blue-400 text-blue-400" : "border-black text-black")
                    : "border-transparent text-gray-400 hover:text-gray-600"}`}>
                Description
              </button>
            </div>

            {/* Tab Content */}
            <div className="min-h-[100px]">
              {activeTab === "details" ? (
                <div className={`space-y-3 text-base ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  <p><span className="font-bold text-gray-800 dark:text-gray-200">SKU:</span> PRD-{product.id}00</p>
                  <p><span className="font-bold text-gray-800 dark:text-gray-200">Category:</span> {product.category}</p>
                  <p><span className="font-bold text-gray-800 dark:text-gray-200">Availability:</span> In Stock</p>
                </div>
              ) : (
                <p className={`text-base leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  {product.description}
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductDetail;