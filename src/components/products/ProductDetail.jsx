import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react"; // Added useEffect for navigation fix
import { useTheme } from "../ThemeContext";
import { useCart } from "../CartContext";
import useFetch from "../../hooks/useFetch"; 
import { toast } from "react-toastify";

// Swiper Imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { addToCart } = useCart();

  // API Data Fetching
  const { data: apiData, loading, error } = useFetch(`https://dummyjson.com/products?limit=0`);

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details");

  // --- NAVIGATION & REFRESH FIX ---
  // Jab bhi URL ki 'id' change hogi, ye function page ko upar le jayega aur states reset kar dega
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setQuantity(1);
    setActiveTab("details");
  }, [id]); 

  // Current product filtering
  const product = useMemo(() => {
    return apiData?.products?.find((p) => p.id === parseInt(id));
  }, [apiData, id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.success(`${product.title} added to cart!`, {
        icon: "🛒",
        position: "bottom-right"
      });
    }
  };

  // Related products based on category
  const relatedProducts = useMemo(() => {
    if (!product || !apiData) return [];
    return apiData.products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 8);
  }, [product, apiData]);

  if (loading) return <div className="pt-32 text-center min-h-screen font-bold">Loading...</div>;
  if (error) return <div className="pt-32 text-center text-red-500">{error}</div>;
  if (!product) return <div className="pt-32 text-center">Product not found</div>;

  return (
    <div className={`pt-24 pb-12 px-5 min-h-screen transition-all duration-300 ${isDark ? "bg-[#121212]" : "bg-gray-50"}`}>
      <div className={`mx-auto max-w-6xl p-6 md:p-10 rounded-2xl border ${isDark ? "bg-[#1e1e1e] text-white border-[#333]" : "bg-white text-black border-gray-100 shadow-sm"}`}>
        
        {/* Back Button */}
        <button onClick={() => navigate("/products")} className={`text-sm font-bold mb-8 bg-transparent border-none flex items-center gap-1 cursor-pointer hover:opacity-70 ${isDark ? "text-gray-400" : "text-black"}`}>
          ← BACK TO SHOP
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Left: Product Image */}
          <div className="flex flex-col gap-6">
            <div className={`rounded-2xl p-6 flex items-center justify-center min-h-[350px] md:min-h-[450px] ${isDark ? "bg-white/5" : "bg-[#f9f9f9]"}`}>
              <img src={product.thumbnail} alt={product.title} className="max-h-[300px] md:max-h-[400px] object-contain" />
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col">
            <span className={`text-xs font-black uppercase tracking-widest mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{product.category}</span>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.title}</h1>
            <p className="text-3xl font-black mb-8 text-black dark:text-white">${product.price.toFixed(2)}</p>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200 mb-6">
              <button onClick={() => setActiveTab("details")} className={`pb-2 text-sm font-bold cursor-pointer transition-all ${activeTab === "details" ? (isDark ? "border-b-2 border-white text-white" : "border-b-2 border-black text-black") : "text-gray-400"}`}>DETAILS</button>
              <button onClick={() => setActiveTab("description")} className={`pb-2 text-sm font-bold cursor-pointer transition-all ${activeTab === "description" ? (isDark ? "border-b-2 border-white text-white" : "border-b-2 border-black text-black") : "text-gray-400"}`}>DESCRIPTION</button>
            </div>

            <div className="min-h-[100px] text-sm leading-relaxed opacity-80 mb-8">
              {activeTab === "details" ? (
                <div className="space-y-2">
                  <p><b>Brand:</b> {product.brand || "Generic"}</p>
                  <p><b>Rating:</b> ⭐ {product.rating}</p>
                  <p><b>Stock:</b> {product.stock > 0 ? `${product.stock} units left` : "Out of Stock"}</p>
                </div>
              ) : (
                <p>{product.description}</p>
              )}
            </div>

            {/* Quantity & Cart Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-auto">
              <div className="flex items-center gap-4 border rounded-xl p-2 px-4 w-full sm:w-auto justify-between">
                <span className="font-bold text-xs uppercase opacity-60">Qty</span>
                <div className="flex items-center gap-4">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer hover:bg-black hover:text-white transition-colors">-</button>
                  <span className="font-bold w-4 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer hover:bg-black hover:text-white transition-colors">+</button>
                </div>
              </div>
              <button onClick={handleAddToCart} className={`w-full py-4 rounded-xl font-bold transition-all cursor-pointer shadow-lg active:scale-95 ${isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white"}`}>
                ADD TO CART
              </button>
            </div>
          </div>
        </div>

        {/* --- RELATED PRODUCTS CAROUSEL --- */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t">
            <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
            
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={2}
              navigation={true} 
              pagination={{ clickable: true }}
              style={{
                "--swiper-navigation-color": "#000",
                "--swiper-pagination-color": "#000",
                "--swiper-navigation-size": "20px", 
              }}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              className="pb-24 px-4 product-swiper" 
            >
              {relatedProducts.map((rp) => (
                <SwiperSlide key={rp.id}>
                  <div 
                    onClick={() => navigate(`/product/${rp.id}`)}
                    className={`group cursor-pointer p-4 rounded-2xl transition-all duration-300 h-full border ${
                      isDark ? "bg-[#252525] border-[#333] hover:border-white" : "bg-white border-gray-100 shadow-sm hover:shadow-lg"
                    }`}
                  >
                    <div className={`aspect-square rounded-lg overflow-hidden mb-4 flex items-center justify-center p-4 ${isDark ? "bg-white/5" : "bg-[#f9f9f9]"}`}>
                      <img src={rp.thumbnail} alt={rp.title} className="max-h-full w-full object-contain group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <h3 className="font-bold text-sm truncate mb-1">{rp.title}</h3>
                    <p className="text-black dark:text-gray-300 font-bold text-sm">${rp.price.toFixed(2)}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;