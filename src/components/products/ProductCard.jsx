import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import { Heart, ShoppingCart } from "lucide-react"; 

function ProductCard(props) {
  const { product } = props;
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Destructuring product data
  const { id, thumbnail, title, category, price } = product;

  // 1. Sync Wishlist status on component mount
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const isAdded = wishlist.some((item) => item.id === id);
    setIsInWishlist(isAdded);
  }, [id]);

  // --- 2. CART LOGIC: LocalStorage Based ---
  const handleAddToCart = (e) => {
    e.stopPropagation(); // Card click (navigate) ko rokne ke liye
    
    // Purana cart data uthayein
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Check karein ke product pehle se cart mein hai?
    const existingProductIndex = cart.findIndex((item) => item.id === id);

    if (existingProductIndex > -1) {
      // Agar hai, toh quantity barha dein
      cart[existingProductIndex].quantity += 1;
    } else {
      // Agar naya hai, toh item add karein
      cart.push({ ...product, quantity: 1 });
    }

    // LocalStorage update karein
    localStorage.setItem("cart", JSON.stringify(cart));

    // Navbar ko update signal bhejne ke liye
    window.dispatchEvent(new Event("cartUpdate"));
    
    alert(`${title} added to cart!`);
  };

  // 3. Navigation to Product Detail Page
  const handleProductNavigation = () => {
    navigate(`/products/${id}`);
  };

  // 4. Wishlist Toggle Logic
  const toggleWishlist = (e) => {
    e.stopPropagation(); 
    
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const exists = wishlist.find((item) => item.id === id);

    if (exists) {
      wishlist = wishlist.filter((item) => item.id !== id);
      setIsInWishlist(false);
    } else {
      wishlist.push(product);
      setIsInWishlist(true);
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    window.dispatchEvent(new Event("wishlistUpdate"));
  };

  // 5. Theme based styling
  const getCardTheme = () => {
    return isDark 
      ? "bg-[#1e1e1e] border-[#333] text-white" 
      : "bg-white border-gray-100 text-black hover:shadow-xl";
  };

  // --- SALE LOGIC ---
  const isSale = category?.toLowerCase().includes("fragrances") || category?.toLowerCase().includes("clearance");

  return (
    <div 
      onClick={handleProductNavigation}
      className={`group cursor-pointer rounded-2xl p-4 transition-all duration-300 border relative ${getCardTheme()}`}
    >
      {/* Product Image Section */}
      <div className={`relative aspect-square rounded-xl overflow-hidden mb-4 ${isDark ? "bg-white/5" : "bg-[#f9f9f9]"}`}>
        
        {/* --- SALE TAG: Red Color --- */}
        {isSale && (
          <div className="absolute top-0 left-0 z-30 bg-[#ff4444] text-white text-[9px] font-black px-3 py-1.5 uppercase tracking-wider rounded-br-lg">         
             15% OFF
          </div>
        )}

        {/* --- WISHLIST BUTTON --- */}
        <button 
          onClick={toggleWishlist}
          className="absolute top-3 right-3 z-20 w-9 h-9 flex items-center justify-center bg-black rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-90 border border-white/10"
        >
          <Heart 
            size={18} 
            strokeWidth={2} 
            className={`transition-all duration-300 ${
              isInWishlist ? "fill-[#00bcd4] text-[#00bcd4]" : "text-white"
            }`} 
          />
        </button>

        <img 
          src={thumbnail} 
          alt={title} 
          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
        />
        
        <div className="absolute top-2 left-2">
          {!isSale && (
            <p className="font-black text-[10px] uppercase tracking-widest opacity-50">
              {category}
            </p>
          )}
        </div>
      </div>

      {/* Product Info Section */}
      <div className="space-y-2">
        {/* Price */}
        <div className={`inline-block px-2 py-0.5 rounded text-xs font-black ${isDark ? "bg-white text-black" : "bg-black text-white"}`}>
          ${price}
        </div>

        {/* Title */}
        <h3 className="font-bold text-sm truncate">
          {title}
        </h3>
        
        {/* --- ADD TO CART BUTTON --- */}
        <button 
          onClick={handleAddToCart}
          className={`w-full mt-2 py-2.5 text-[10px] font-black border rounded-lg transition-all tracking-widest uppercase flex items-center justify-center gap-2 ${
            isDark 
              ? "border-[#00bcd4] text-[#00bcd4] hover:bg-[#00bcd4] hover:text-black" 
              : "border-black bg-black text-white hover:bg-gray-800 shadow-sm"
          }`}
        >
          <ShoppingCart size={13} /> Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;