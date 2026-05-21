import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import { Heart, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react"; 
import { toast } from "react-toastify";
import { API_BASE_URL, IMAGE_BASE_URL } from '../../Config/Api';


function ProductCard({ product, isSale: isSectionSale }) {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [isInWishlist, setIsInWishlist] = useState(false);

  const { id, title, name, category, price, image, thumbnail, images } = product;
  
  const productRealName = name || title || "Product";

  const displayImage = (img) => {
  if (!img) return "https://via.placeholder.com/400?text=No+Image";
  if (img.startsWith("http")) return img;
  
  // Agar img path ke shuru mein '/' hai to use hata dein
  const cleanPath = img.startsWith('/') ? img.substring(1) : img;
  
  return `${IMAGE_BASE_URL}/${cleanPath}`;
};
  const imageList = useMemo(() => {
    if (images && Array.isArray(images) && images.length > 0) return images;
    if (typeof images === "string") {
      try {
        const parsed = JSON.parse(images);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [image || thumbnail || product.img_url || ""];
  }, [images, image, thumbnail, product.img_url]);
  
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    if (imageList.length <= 1) return; 

    const interval = setInterval(() => {
      setCurrentImgIndex((prevIndex) => (prevIndex + 1) % imageList.length);
    }, 3000); 

    return () => clearInterval(interval); 
  }, [imageList]);

  const nextImage = (e) => {
    e.stopPropagation(); 
    setCurrentImgIndex((prev) => (prev + 1) % imageList.length);
  };

  const prevImage = (e) => {
    e.stopPropagation(); 
    setCurrentImgIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setIsInWishlist(wishlist.some((item) => item.id === id));
  }, [id]);

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (!loggedInUser) {
      toast.error("Please login first!", { theme: "colored" });
      return;
    }

    const cartData = {
      user_id: loggedInUser.id, 
      productId: id,
      image: imageList[currentImgIndex], 
      price: price,
      category: category,
      quantity: 1
    };

    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cartData)
      });

      if (response.ok) {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingIndex = cart.findIndex((item) => item.id === id);

        if (existingIndex > -1) {
          cart[existingIndex].quantity += 1;
        } else {
          cart.push({ ...product, quantity: 1, image: imageList[currentImgIndex] });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        
        window.dispatchEvent(new Event("cartUpdate"));
        
        toast.success(`${productRealName} added to cart!`, {
          position: "top-right",
          autoClose: 2000,
          theme: "colored",
        });
      } else {
        toast.error("Could not update cart. Please try again!", {
          position: "top-right",
          autoClose: 2000,
          theme: "colored",
        });
      }

    } catch (err) {
      console.error("Cart Action Failed:", err);
      toast.error("Server connection failed. Please try again later.", {
        position: "top-right",
        autoClose: 2000,
        theme: "colored",
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
        toast.success("Added to wishlist", { position: "top-right", autoClose: 1500, theme: "colored" });
      }

      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      window.dispatchEvent(new Event("wishlistUpdate"));
    } catch (err) {
      console.error("Wishlist update failed:", err);
    }
  };

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

          {/* Sale Tag */}
          {isSale && (
            <div className="absolute top-0 left-0 z-30 bg-[#ff4a5a] text-white text-[9px] font-black px-3 py-1.5 uppercase tracking-wider rounded-br-lg shadow-sm">
              15% OFF
            </div>
          )}

          {/* Wishlist Button */}
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

          {/* Slider Navigation Arrows */}
          {imageList.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}
          {/* Quick View Button (Without Icon) */}
<div className="absolute inset-0 z-20 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-md:opacity-100">
  <button className="bg-black text-white px-6 py-2 rounded-full font-bold text-xs shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
    QUICK VIEW
  </button>
</div>

          {/* Main Displaying Image */}
          <img
            src={displayImage(imageList[currentImgIndex])}
            alt={productRealName}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          />

          {/* Slider Dots Indicators */}
          {imageList.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 z-20 flex justify-center gap-1.5">
              {imageList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation(); 
                    setCurrentImgIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentImgIndex === idx ? "w-4 bg-[#00bcd4]" : "w-1.5 bg-gray-400/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="space-y-1">
          {/* Product Title */}
          <h3 className="font-bold text-sm truncate opacity-90">{productRealName}</h3>
          
          {/* Category Pill Tag */}
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

      
    </div>
  );
}

export default ProductCard;