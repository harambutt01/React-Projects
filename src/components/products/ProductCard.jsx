import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import { Heart, ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";

function ProductCard({ product, isSale: isSectionSale }) {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Variable Destructuring
  const { id, title, category, price, image, thumbnail, images } = product;

  // --- SAFE IMAGE LOGIC ---
  const productImage = image || thumbnail || (images && images[0]) || "";

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setIsInWishlist(wishlist.some((item) => item.id === id));
  }, [id]);

  // HANDLE ADD TO CART (Database + LocalStorage) ---
  const handleAddToCart = async (e) => {
    e.stopPropagation();

    // User login check
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (!loggedInUser) {
      toast.error("Please login first!", { theme: "colored" });
      return;
    }

    const cartData = {
      user_id: loggedInUser.id, 
      productId: id,
      image: productImage, 
      price: price,
      category: category,
      quantity: 1
    };

    try {
      const response = await fetch('http://localhost:4000/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cartData)
      });

      if (response.ok) {
        // Update LocalStorage (for CartDrawer UI sync)
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingIndex = cart.findIndex((item) => item.id === id);

        if (existingIndex > -1) {
          cart[existingIndex].quantity += 1;
        } else {
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
        // Safe professional error message
        toast.error("Could not update cart. Please try again!", {
          position: "top-right",
          autoClose: 2000,
          theme: isDark ? "dark" : "light",
        });
      }

    } catch (err) {
      console.error("Cart Action Failed:", err);
      toast.error("Server connection failed. Please try again later.", {
        position: "top-right",
        autoClose: 2000,
        theme: isDark ? "dark" : "light",
      });
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

  // FIXED: Agar clearance section se aaye ya category "tech accessories" ho, dono surton mein sale true hogi
  const isSale = !!isSectionSale || category?.toLowerCase() === "tech accessories";

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
      className={`group cursor-pointer rounded-2xl p-4 transition-all duration-300 border relative flex flex-col justify-between ${cardBg}`}
    >
      <div>
        {/* Image Section */}
        <div className={`relative aspect-square rounded-xl overflow-hidden mb-4 ${isDark ? "bg-white/5" : "bg-[#f9f9f9]"}`}>

          {/* 🟢 Sale Tag: Wapis apni original corner-attached professional position par */}
          {isSale && (
            <div className="absolute top-0 left-0 z-30 bg-[#ff4a5a] text-white text-[9px] font-black px-3 py-1.5 uppercase tracking-wider rounded-br-lg shadow-sm">
              15% OFF
            </div>
          )}

          {/* 🟢 Wishlist Button: Wapis apni asli clean position par single single */}
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
            src={productImage}
            alt={title}
            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Info Section */}
        <div className="space-y-1">
          {/* Product Title */}
          <h3 className="font-bold text-sm truncate opacity-90">{title}</h3>
          
          {/* 🟢 Category Pill Tag: Ab image se hat kar title aur price ke beech mein aa gayi */}
          <div className="pt-0.5">
            <p className="font-black text-[9px] uppercase tracking-widest text-gray-400 dark:text-gray-500">
              {category}
            </p>
          </div>
          
          {/* Price Section */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            {isSale ? (
              <>
                <div className="inline-block px-2 py-0.5 rounded text-xs font-black text-[#ff4a5a] bg-red-50 dark:bg-red-950/40">
                  ${discountedPrice}
                </div>
                <span className={`text-xs font-medium line-through opacity-40 ${isDark ? "text-white" : "text-black"}`}>
                  ${price}
                </span>
              </>
            ) : (
              <div className={`inline-block px-2 py-0.5 rounded text-xs font-black ${priceBadge}`}>
                ${price}
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        className={`w-full mt-4 py-2.5 text-[10px] font-black border rounded-lg transition-all tracking-widest uppercase flex items-center justify-center gap-2 ${cartBtn}`}
      >
        <ShoppingCart size={13} /> Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;