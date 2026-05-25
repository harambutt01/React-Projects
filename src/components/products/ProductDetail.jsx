import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { useTheme } from "../ThemeContext";
import { useCart } from "../CartContext";
import useFetch from "../../hooks/useFetch";
import { toast } from "react-toastify";
import { API_BASE_URL, IMAGE_BASE_URL } from '../../Config/Api';

// Swiper imports for Related Products slider
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { addToCart } = useCart(); 

  const { data: apiData, loading, error } = useFetch(`${API_BASE_URL}/api/products/${id}`);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details");
  const [selectedImage, setSelectedImage] = useState(null);
  const [localReviews, setLocalReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ reviewerName: "", comment: "", rating: 5 });
  const [relatedProducts, setRelatedProducts] = useState([]);

  const displayImage = (img) => {
    if (!img) return "https://via.placeholder.com/400?text=No+Image";
    if (img.startsWith("http")) return img;

    const path = img.startsWith('/') ? img : `/${img}`;
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;

    return `${baseUrl}${path}`;
  };

  const product = useMemo(() => {
    if (!apiData) return null;
    if (apiData.products && Array.isArray(apiData.products)) {
      return apiData.products.find((p) => p.id === parseInt(id));
    }
    if (Array.isArray(apiData)) return apiData[0];
    return apiData;
  }, [apiData, id]);

  const allProductImages = useMemo(() => {
    if (!product) return [];
    
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images;
    }
    
    if (typeof product.images === "string") {
      try {
        const parsed = JSON.parse(product.images);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }

    const fallbackArray = [
      product.image,
      product.thumbnail,
      product.img_url
    ].filter((img) => img && typeof img === "string" && img.trim() !== "");

    return [...new Set(fallbackArray)];
  }, [product]);

  const sortedReviews = useMemo(() => {
    return [...localReviews].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [localReviews]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products/${id}/reviews`);
        const data = await response.json();
        setLocalReviews(data.reviews || []);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      }
    };
    if (id) fetchReviews();
  }, [id]);

  useEffect(() => {
    if (product && product.category) {
      const fetchRelated = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/products/related/${product.category}/${id}`);
          const data = await response.json();
          setRelatedProducts(data);
        } catch (err) {
          console.error("Related products fetch error:", err);
        }
      };
      fetchRelated();
    }
  }, [product, id]);

  useEffect(() => {
    if (!product) return;
    window.scrollTo({ top: 0, behavior: "smooth" }); 
    setQuantity(1);
    setActiveTab("details");
    setShowReviewForm(false);
    
    const mainImg = product.image || product.thumbnail || product.img_url;
    setSelectedImage(mainImg);
  }, [id, product]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (!savedUser) {
      toast.error("Please login to post a review!");
      navigate("/login");
      return;
    }

    const reviewPayload = {
      ...newReview,
      reviewerName: savedUser.name || "Anonymous"
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewPayload)
      });

      if (response.ok) {
        const updatedData = await fetch(`${API_BASE_URL}/api/products/${id}/reviews`).then(res => res.json());
        setLocalReviews(updatedData.reviews || []);
        setNewReview({ reviewerName: "", comment: "", rating: 5 });
        setShowReviewForm(false);
        toast.success("Review saved!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to save review");
      }
    } catch (err) {
      toast.error("Server connection failed");
    }
  };

  const handleTabChange = (tab) => setActiveTab(tab);
  const handleQuantityIncrease = () => setQuantity((q) => q + 1);
  const handleQuantityDecrease = () => setQuantity((q) => Math.max(1, q - 1));
  const handleReviewInput = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };
  const handleRatingChange = (e) => {
    setNewReview((prev) => ({ ...prev, rating: parseInt(e.target.value) }));
  };
  const toggleReviewForm = () => setShowReviewForm((prev) => !prev);

  const handleAddToCart = async () => {
    if (!product) return;
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (!savedUser || !savedUser.id) {
      toast.error("Please login first to add items to cart!");
      navigate("/login");
      return;
    }

    // Fix: Sahi image path nikalna
    const actualImagePath = product.image_url || product.image || product.thumbnail || "";

    const cartPayload = {
        user_id: savedUser.id,
        productId: product.id,
        price: product.price,
        image_url: actualImagePath,
        category: product.category,
        quantity: quantity
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cartPayload)
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(`${product.name || product.title} added to cart!`, { icon: "🛒" });
        addToCart(product, quantity);
      } else {
        toast.error(result.error || "Failed to add to cart");
      }
    } catch (err) {
      console.error("Cart Action Failed:", err);
      toast.error("Connection to server failed");
    }
  };

  const handleRelatedProductClick = (productId) => navigate(`/products/${productId}`);
  const handleBackToShop = () => navigate("/products");

  if (loading) return <div className="pt-32 text-center min-h-screen font-bold">Loading...</div>;
  if (error) return <div className="pt-32 text-center text-red-500">{error}</div>;
  if (!product) return <div className="pt-32 text-center">Product not found</div>;

  const cardBg = isDark ? "bg-[#1e1e1e] text-white border-[#333]" : "bg-white text-black border-gray-100 shadow-sm";
  const imgBg = isDark ? "bg-white/5" : "bg-[#f9f9f9]";

  return (
    <div className={`pt-24 pb-12 px-4 md:px-5 min-h-screen ${isDark ? "bg-[#121212]" : "bg-gray-50"}`}>
      <div className={`mx-auto max-w-6xl p-4 md:p-10 rounded-2xl border ${cardBg}`}>
        <button onClick={handleBackToShop} className={`text-sm font-bold mb-6 flex items-center gap-1 hover:opacity-70 ${isDark ? "text-gray-400" : "text-black"}`}>
          ← BACK TO SHOP
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16">
          <div className="flex flex-col gap-4">
            <div className={`rounded-2xl p-6 flex items-center justify-center min-h-[300px] md:min-h-[450px] ${imgBg}`}>
              <img src={displayImage(selectedImage)} alt={product.title || product.name} className="max-h-[280px] md:max-h-[400px] object-contain hover:scale-105 transition-all duration-500" />
            </div>

            {allProductImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto py-2 pr-2 scrollbar-none">
                {allProductImages.map((imgUrl, index) => {
                  const isCurrentActive = selectedImage === imgUrl;
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(imgUrl)}
                      onMouseEnter={() => setSelectedImage(imgUrl)} 
                      className={`w-16 h-16 md:w-20 md:h-20 rounded-xl p-2 flex items-center justify-center border-2 transition-all duration-200 flex-shrink-0 ${imgBg} ${
                        isCurrentActive 
                          ? (isDark ? "border-[#00bcd4]" : "border-black scale-95") 
                          : (isDark ? "border-transparent opacity-60 hover:opacity-100" : "border-gray-200 opacity-70 hover:opacity-100")
                      }`}
                    >
                      <img src={displayImage(imgUrl)} alt={`thumbnail-${index}`} className="max-h-full max-w-full object-contain" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <span className={`text-xs font-black uppercase tracking-widest mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{product.category}</span>
            <h1 className="text-2xl md:text-4xl font-bold mb-4">{product.title || product.name}</h1>
            <p className="text-2xl md:text-3xl font-black mb-8">${Number(product.price).toFixed(2)}</p>

            <div className="flex gap-6 border-b border-gray-200 mb-6">
              {["details", "description", "reviews"].map((tab) => (
                <button key={tab} onClick={() => handleTabChange(tab)}
                  className={`pb-2 text-xs md:text-sm font-bold uppercase transition-all ${activeTab === tab ? (isDark ? "border-b-2 border-white text-white" : "border-b-2 border-black text-black") : "text-gray-400"}`}>
                  {tab} {tab === "reviews" && `(${localReviews.length})`}
                </button>
              ))}
            </div>

            <div className="min-h-[150px] text-sm leading-relaxed mb-8">
              {activeTab === "details" && (
                <div className="space-y-2 opacity-80">
                  <p><b>Brand:</b> {product.brand || "Generic"}</p>
                  <p><b>Rating:</b> ⭐ {product.rating || "N/A"}</p>
                  <p><b>Stock:</b> {product.stock > 0 ? `${product.stock} units left` : "Out of Stock"}</p>
                </div>
              )}
              {activeTab === "description" && <p className="opacity-80">{product.description}</p>}
              {activeTab === "reviews" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold">Reviews</h4>
                    <button onClick={toggleReviewForm} className="text-[10px] px-3 py-1.5 rounded-lg font-bold border">
                      {showReviewForm ? "CANCEL" : "WRITE A REVIEW"}
                    </button>
                  </div>

                  {showReviewForm && (
                    <form onSubmit={handleReviewSubmit} className="space-y-3 mb-6 p-4 border rounded-xl">
                      <input type="text" name="reviewerName" placeholder="Your Name" value={newReview.reviewerName} onChange={handleReviewInput} className="w-full p-2 rounded border bg-transparent" required />
                      <textarea name="comment" placeholder="Your Review" value={newReview.comment} onChange={handleReviewInput} className="w-full p-2 rounded border bg-transparent" rows="3" required />
                      <div className="flex items-center gap-2">
                        <span className="text-xs">Rating:</span>
                        <select value={newReview.rating} onChange={handleRatingChange} className="p-1 rounded border bg-transparent text-black">
                          {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                        </select>
                      </div>
                      <button type="submit" className="w-full py-2 bg-black text-white rounded-lg font-bold text-xs">POST REVIEW</button>
                    </form>
                  )}

                  <div className="max-h-[300px] overflow-y-auto pr-2">
                    {sortedReviews.length > 0 ? sortedReviews.map((rev, i) => (
                      <div key={i} className="p-4 rounded-xl border mb-2">
                        <div className="flex justify-between mb-1">
                          <span className="font-bold text-xs">{rev.reviewerName}</span>
                          <span className="text-yellow-500 text-[10px]">{"⭐".repeat(rev.rating)}</span>
                        </div>
                        <p className="text-xs italic">"{rev.comment}"</p>
                        <p className="text-[9px] opacity-50 mt-1">{new Date(rev.date).toLocaleDateString()}</p>
                      </div>
                    )) : <p className="text-xs opacity-50">No reviews yet. Be the first!</p>}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-auto">
              <div className="flex items-center gap-4 border rounded-xl p-2 px-4 w-full sm:w-auto justify-between">
                <span className="font-bold text-xs uppercase opacity-60">Qty</span>
                <div className="flex items-center gap-4">
                  <button onClick={handleQuantityDecrease} className="w-8 h-8 rounded-full border">-</button>
                  <span className="font-bold w-4 text-center">{quantity}</span>
                  <button onClick={handleQuantityIncrease} className="w-8 h-8 rounded-full border">+</button>
                </div>
              </div>
              <button onClick={handleAddToCart} className="w-full py-4 rounded-xl font-bold bg-black text-white">ADD TO CART</button>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t overflow-hidden">
            <h2 className="text-xl md:text-2xl font-bold mb-8 uppercase tracking-tight">You May Also Like</h2>
            
            <Swiper 
              modules={[Navigation, Pagination, Autoplay]} 
              spaceBetween={12} 
              slidesPerView={1.3} 
              navigation 
              pagination={{ clickable: true }}
              autoplay={{
                delay: 2000,                
                disableOnInteraction: false, 
                pauseOnMouseEnter: false    
              }}
              breakpoints={{ 640: { slidesPerView: 2 }, 768: { slidesPerView: 3 }, 1024: { slidesPerView: 4 } }} 
              className="product-swiper pb-14"
            >
              {relatedProducts.map((rp) => (
                <SwiperSlide key={rp.id}>
                  <div onClick={() => handleRelatedProductClick(rp.id)} className={`group cursor-pointer p-3 md:p-4 rounded-2xl border ${isDark ? "bg-[#252525] border-[#333]" : "bg-white shadow-sm"}`}>
                    <div className={`aspect-[3/4] rounded-lg overflow-hidden mb-4 flex items-center justify-center p-4 ${imgBg}`}>
                      <img src={displayImage(rp.image)} alt={rp.name} className="max-h-full w-full object-contain group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <h3 className="font-bold text-[12px] md:text-sm truncate mb-1 uppercase">{rp.name}</h3>
                    <p className="font-bold text-sm">${Number(rp.price).toFixed(2)}</p>
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