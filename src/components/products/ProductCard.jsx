import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import { Heart, ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";

function ProductCard({ product }) {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Variable Destructuring (id, title, etc. nikalna)
  const { id, title, category, price, image, thumbnail, images } = product;

  // --- SAFE IMAGE LOGIC ---
  const productImage = image || thumbnail || (images && images[0]) || "";
  console.log(productImage)
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setIsInWishlist(wishlist.some((item) => item.id === id));
  }, [id]);

  //  HANDLE ADD TO CART (Database + LocalStorage) ---
  const handleAddToCart = async (e) => {
    e.stopPropagation();

    //  User login check
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (!loggedInUser) {
      toast.error("Please login first!", { theme: "colored" });
      return;
    }

    //   MySQL API
    const cartData = {
  user_id: loggedInUser.id, 
  productId: id,
  image: productImage, 
  price: price,
  category: category,
  quantity: 1
};

// Debugging  console check
console.log("Sending Payload to Database:", cartData);
    try {
      // Custom API (Backend)
      const response = await fetch('http://localhost:4000/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cartData)
      });
console.log("Sending Payload to Database:", cartData);
      if (response.ok) {
        // 4. Update LocalStorage (for CartDrawer UI sync)
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingIndex = cart.findIndex((item) => item.id === id);

        if (existingIndex > -1) {
          cart[existingIndex].quantity += 1;
        } else {
          // Pura product object bhej rahe hain taake local cart mein bhi details rahein
          cart.push({ ...product, quantity: 1, image: productImage });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        
        // Custom event to refresh UI
        window.dispatchEvent(new Event("cartUpdate"));
        
        toast.success(`${title} added to cart!`, {
          position: "top-right",
          autoClose: 2000,
          theme: isDark ? "dark" : "light",
        });
      } else {
        toast.error("Failed to sync with database");
      }

    } catch (err) {
      console.error("Cart API Error:", err);
      toast.error("Server connection failed");
    }
  };

  const handleProductNavigation = () => {
    navigate(`/products/${id}`);
  };

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    try {
      let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      const alreadyAdded = wishlist.some((item) => item.id === id);

      if (alreadyAdded) {
        wishlist = wishlist.filter((item) => item.id !== id);
        setIsInWishlist(false);
        toast.error("Removed from wishlist", { position: "top-right", autoClose: 1500, theme: "colored" });
      } else {
        wishlist.push(product);
        setIsInWishlist(true);
        toast.success("Added to wishlist", { position: "top-right", autoClose: 1500 });
      }

      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      window.dispatchEvent(new Event("wishlistUpdate"));
    } catch (err) {
      console.error("Wishlist update failed:", err);
    }
  };

  const isSale = category?.toLowerCase().includes("fragrances") ||
                  category?.toLowerCase().includes("clearance");

  const discountedPrice = isSale ? (price - (price * 15) / 100).toFixed(2) : null;

  const cardBg = isDark
    ? "bg-[#1e1e1e] border-[#333] text-white"
    : "bg-white border-gray-100 text-black hover:shadow-xl";

  const cartBtn = isDark
    ? "border-[#00bcd4] text-[#00bcd4] hover:bg-[#00bcd4] hover:text-black"
    : "border-black bg-black text-white hover:bg-gray-800 shadow-sm";

  const priceBadge = isDark ? "bg-white text-black" : "bg-black text-white";

  return (
    <div
      onClick={handleProductNavigation}
      className={`group cursor-pointer rounded-2xl p-4 transition-all duration-300 border relative ${cardBg}`}
    >
      {/* Image Section */}
      <div className={`relative aspect-square rounded-xl overflow-hidden mb-4 ${isDark ? "bg-white/5" : "bg-[#f9f9f9]"}`}>

        {isSale && (
          <div className="absolute top-0 left-0 z-30 bg-[#ff4444] text-white text-[9px] font-black px-3 py-1.5 uppercase tracking-wider rounded-br-lg">
            15% OFF
          </div>
        )}

        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 z-20 w-9 h-9 flex items-center justify-center bg-black rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-90 border border-white/10"
        >
          <Heart
            size={18}
            strokeWidth={2}
            className={`transition-all duration-300 ${isInWishlist ? "fill-[#00bcd4] text-[#00bcd4]" : "text-white"}`}
          />
        </button>

        <img
          src={productImage} // Updated to use the safe image variable
          alt={title}
          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
        />

        {!isSale && (
          <div className="absolute top-2 left-2">
            <p className="font-black text-[10px] uppercase tracking-widest opacity-50">
              {category}
            </p>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          {isSale ? (
            <>
              <div className="inline-block px-2 py-0.5 rounded text-xs font-black text-red-500 bg-red-50">
                ${discountedPrice}
              </div>
              <span className={`text-xs font-bold line-through opacity-40 ${isDark ? "text-white" : "text-black"}`}>
                ${price}
              </span>
            </>
          ) : (
            <div className={`inline-block px-2 py-0.5 rounded text-xs font-black ${priceBadge}`}>
              ${price}
            </div>
          )}
        </div>

        <h3 className="font-bold text-sm truncate">{title}</h3>

        <button
          onClick={handleAddToCart}
          className={`w-full mt-2 py-2.5 text-[10px] font-black border rounded-lg transition-all tracking-widest uppercase flex items-center justify-center gap-2 ${cartBtn}`}
        >
          <ShoppingCart size={13} /> Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;