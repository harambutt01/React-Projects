import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { useTheme } from "../ThemeContext";
import { useCart } from "../CartContext";
import useFetch from "../../hooks/useFetch"; 
import { toast } from "react-toastify"; // Step 1: Toast import karein

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { addToCart } = useCart();

  const { data: apiData, loading, error } = useFetch(`https://dummyjson.com/products?limit=0`);

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details");

  const product = useMemo(() => {
    return apiData?.products?.find((p) => p.id === parseInt(id));
  }, [apiData, id]);

  // Toast Handler Function
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      
      // Step 2: Notification trigger karein
      toast.success(`${product.title} added to cart!`, {
        icon: "🛒" // Optional: Emoji add kar dein toh natural lagta hai
      });
    }
  };

  const relatedProducts = useMemo(() => {
    if (!product || !apiData) return [];
    return apiData.products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product, apiData]);

  if (loading) return <div className="pt-32 text-center min-h-screen">Loading...</div>;
  if (error) return <div className="pt-32 text-center text-red-500">{error}</div>;
  if (!product) return <div className="pt-32 text-center">Product not found</div>;

  return (
    <div className={`pt-24 pb-12 px-5 min-h-screen ${isDark ? "bg-[#121212]" : "bg-gray-50"}`}>
      <div className={`mx-auto max-w-6xl p-8 rounded-2xl border ${isDark ? "bg-[#1e1e1e] text-white border-[#333]" : "bg-white text-black border-gray-100"}`}>
        
        <button onClick={() => navigate("/products")} className={`text-sm font-bold mb-8 bg-transparent border-none flex items-center gap-1 cursor-pointer ${isDark ? "text-gray-400" : "text-black"}`}>
          ← BACK TO SHOP
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex flex-col gap-6">
            <div className={`rounded-2xl p-6 flex items-center justify-center min-h-[400px] ${isDark ? "bg-white/5" : "bg-[#f9f9f9]"}`}>
              <img src={product.thumbnail} alt={product.title} className="max-h-[350px] object-contain" />
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="font-bold text-sm">Quantity:</span>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                    className={`w-9 h-9 rounded-full border cursor-pointer ${isDark ? "border-gray-600" : "border-black"}`}
                  >-</button>
                  <span className="font-bold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)} 
                    className={`w-9 h-9 rounded-full border cursor-pointer ${isDark ? "border-gray-600" : "border-black"}`}
                  >+</button>
                </div>
              </div>
              
              {/* Button par handleAddToCart attach kar diya */}
              <button 
                onClick={handleAddToCart} 
                className={`w-full py-4 rounded-xl font-bold transition-all cursor-pointer ${isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:opacity-90"}`}
              >
                ADD TO CART
              </button>
            </div>
          </div>

          <div className="flex flex-col">
            <span className={`text-xs font-black uppercase tracking-widest mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{product.category}</span>
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            <p className="text-3xl font-black mb-8">${product.price.toFixed(2)}</p>

            <div className="flex gap-6 border-b border-gray-200 mb-6">
              <button onClick={() => setActiveTab("details")} className={`pb-2 text-sm font-bold cursor-pointer ${activeTab === "details" ? (isDark ? "border-b-2 border-white text-white" : "border-b-2 border-black text-black") : "text-gray-400"}`}>DETAILS</button>
              <button onClick={() => setActiveTab("description")} className={`pb-2 text-sm font-bold cursor-pointer ${activeTab === "description" ? (isDark ? "border-b-2 border-white text-white" : "border-b-2 border-black text-black") : "text-gray-400"}`}>DESCRIPTION</button>
            </div>

            <div className="min-h-[100px] text-sm leading-relaxed opacity-80">
              {activeTab === "details" ? (
                <p><b>Brand:</b> {product.brand}<br/><b>Rating:</b> ⭐ {product.rating}<br/><b>Stock:</b> {product.stock}</p>
              ) : (
                <p>{product.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;