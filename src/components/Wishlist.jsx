import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import { useCart } from "./CartContext";
import { toast } from "react-toastify";

// Compact Card Component
const WishlistItem = ({ item, onRemove, onAddToCart, isDark }) => (
  <div className={`group relative rounded-xl border p-2.5 transition-all duration-300 hover:shadow-lg ${
    isDark ? "bg-[#1a1a1a] border-[#333]" : "bg-white border-gray-100"
  } w-full max-w-[200px] mx-auto`}>
    
    {/* Delete Icon */}
    <button 
      onClick={() => onRemove(item.id, item.title)}
      className="absolute top-1.5 right-1.5 z-10 w-5 h-5 flex items-center justify-center bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
    >
      <span className="text-[9px]">✕</span>
    </button>

    {/* Image Container - Height yahan control ho rahi hai */}
    <div className="aspect-square w-full mb-2 bg-white rounded-lg flex items-center justify-center p-1.5 overflow-hidden">
      <img 
        src={item.thumbnail} 
        alt={item.title} 
        className="max-h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
      />
    </div>

    {/* Details - Compact Spacing */}
    <div className="px-1">
      <h3 className="font-bold text-[10px] uppercase tracking-tight truncate leading-tight mb-0.5">
        {item.title}
      </h3>
      <p className="text-[#00bcd4] font-black text-[13px]">${item.price}</p>
    </div>

    {/* Action Button - Small Padding */}
    <button
      onClick={() => onAddToCart(item)}
      className="w-full mt-2 py-1.5 bg-black text-white rounded text-[9px] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all active:scale-95"
    >
      Add to Cart
    </button>
  </div>
);

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { isDark } = useTheme();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const fetchWishlist = () => {
    const data = localStorage.getItem("wishlist");
    setWishlistItems(data ? JSON.parse(data) : []);
  };

  useEffect(() => {
    fetchWishlist();
    window.addEventListener("wishlistUpdate", fetchWishlist);
    return () => window.removeEventListener("wishlistUpdate", fetchWishlist);
  }, []);

  const handleRemove = (id, title) => {
    const updated = wishlistItems.filter(item => item.id !== id);
    localStorage.setItem("wishlist", JSON.stringify(updated));
    setWishlistItems(updated);
    window.dispatchEvent(new Event("wishlistUpdate"));
    toast.error(`${title} removed`, { theme: "colored", autoClose: 1500 });
  };

  return (
    <div className={`min-h-screen pt-24 pb-20 px-4 ${isDark ? "bg-[#121212] text-white" : "bg-[#fafafa] text-black"}`}>
      <div className="max-w-5xl mx-auto">
        
        <header className="mb-6 pb-3 border-b border-gray-500/10">
          <h1 className="text-xl font-black italic uppercase tracking-tighter">
            My Favorites <span className="text-red-500">❤️</span>
          </h1>
        </header>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="opacity-40 text-sm italic font-medium">Your wishlist is currently empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {wishlistItems.map((item) => (
              <WishlistItem 
                key={item.id}
                item={item}
                isDark={isDark}
                onRemove={handleRemove}
                onAddToCart={(p) => { addToCart(p); toast.success("Added to cart!"); }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;