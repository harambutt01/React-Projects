import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
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

  const { data: apiData, loading, error } = useFetch(`https://dummyjson.com/products?limit=0`);

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details");
  const [selectedImage, setSelectedImage] = useState(null);
  
  const [localReviews, setLocalReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ reviewerName: "", comment: "", rating: 5 });

  const product = useMemo(() => {
    return apiData?.products?.find((p) => p.id === parseInt(id));
  }, [apiData, id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setQuantity(1);
    setActiveTab("details");
    setShowReviewForm(false);
    
    if (product) {
      setSelectedImage(product.thumbnail);
      const savedReviews = localStorage.getItem(`reviews_prod_${id}`);
      if (savedReviews) {
        setLocalReviews(JSON.parse(savedReviews));
      } else {
        setLocalReviews(product.reviews || []);
      }
    }
  }, [id, product]); 

  // Reviews submission handler
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.reviewerName.trim() || !newReview.comment.trim()) {
      toast.error("Please fill in all required fields."); 
      return;
    }
    const reviewObject = { ...newReview, date: new Date().toISOString() };
    const updatedReviews = [reviewObject, ...localReviews];
    setLocalReviews(updatedReviews);
    localStorage.setItem(`reviews_prod_${id}`, JSON.stringify(updatedReviews));
    setNewReview({ reviewerName: "", comment: "", rating: 5 });
    setShowReviewForm(false);
    toast.success("Review submitted successfully!"); 
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.success(`${product.title} added to cart!`, { icon: "🛒", position: "bottom-right" });
    }
  };

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
    <div className={`pt-24 pb-12 px-4 md:px-5 min-h-screen transition-all duration-300 ${isDark ? "bg-[#121212]" : "bg-gray-50"}`}>
      <div className={`mx-auto max-w-6xl p-4 md:p-10 rounded-2xl border ${isDark ? "bg-[#1e1e1e] text-white border-[#333]" : "bg-white text-black border-gray-100 shadow-sm"}`}>
        
        <button onClick={() => navigate("/products")} className={`text-sm font-bold mb-6 bg-transparent border-none flex items-center gap-1 cursor-pointer hover:opacity-70 ${isDark ? "text-gray-400" : "text-black"}`}>
          ← BACK TO SHOP
        </button>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16">
          <div className="flex flex-col gap-6">
            <div className={`rounded-2xl p-6 flex items-center justify-center min-h-[300px] md:min-h-[450px] overflow-hidden ${isDark ? "bg-white/5" : "bg-[#f9f9f9]"}`}>
              <img src={selectedImage || product.thumbnail} alt={product.title} className="max-h-[280px] md:max-h-[400px] object-contain transition-all duration-500 hover:scale-105" />
            </div>

            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 pt-1 px-1 custom-scrollbar justify-start items-center">
                {product.images.map((img, index) => (
                  <div key={index} onClick={() => setSelectedImage(img)} className={`w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-xl border-2 cursor-pointer p-1.5 transition-all flex items-center justify-center ${selectedImage === img ? (isDark ? "border-white bg-white/10 scale-105" : "border-black bg-gray-100 scale-105") : "border-transparent opacity-50 hover:opacity-100"}`}>
                    <img src={img} alt="thumbnail" className="w-full h-full object-contain rounded-lg" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <span className={`text-xs font-black uppercase tracking-widest mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{product.category}</span>
            <h1 className="text-2xl md:text-4xl font-bold mb-4">{product.title}</h1>
            <p className="text-2xl md:text-3xl font-black mb-8">${product.price.toFixed(2)}</p>

            {/* Tabs */}
            <div className="flex gap-4 md:gap-6 border-b border-gray-200 mb-6">
              {["details", "description", "reviews"].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-2 text-xs md:text-sm font-bold uppercase cursor-pointer transition-all ${activeTab === tab ? (isDark ? "border-b-2 border-white text-white" : "border-b-2 border-black text-black") : "text-gray-400"}`}>
                  {tab} {tab === "reviews" && `(${localReviews.length})`}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[150px] text-sm leading-relaxed mb-8">
              {activeTab === "details" && (
                <div className="space-y-2 opacity-80">
                  <p><b>Brand:</b> {product.brand || "Generic"}</p>
                  <p><b>Rating:</b> ⭐ {product.rating}</p>
                  <p><b>Stock:</b> {product.stock > 0 ? `${product.stock} units left` : "Out of Stock"}</p>
                </div>
              )}
              {activeTab === "description" && <p className="opacity-80">{product.description}</p>}
              {activeTab === "reviews" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold">Reviews</h4>
                    <button onClick={() => setShowReviewForm(!showReviewForm)} className={`text-[10px] px-3 py-1.5 rounded-lg font-bold border transition-all ${isDark ? "border-white hover:bg-white hover:text-black" : "border-black hover:bg-black hover:text-white"}`}>
                      {showReviewForm ? "CANCEL" : "WRITE A REVIEW"}
                    </button>
                  </div>

                  {showReviewForm && (
                    <form onSubmit={handleReviewSubmit} className={`p-4 rounded-xl border mb-6 space-y-3 ${isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"}`}>
                      <input type="text" placeholder="Your Name" className={`w-full p-2 rounded-lg bg-transparent border text-xs outline-none ${isDark ? "border-white/20" : "border-black/20"}`} value={newReview.reviewerName} onChange={(e) => setNewReview({...newReview, reviewerName: e.target.value})} />
                      <textarea placeholder="Your Comment..." rows="3" className={`w-full p-2 rounded-lg bg-transparent border text-xs outline-none ${isDark ? "border-white/20" : "border-black/20"}`} value={newReview.comment} onChange={(e) => setNewReview({...newReview, comment: e.target.value})}></textarea>
                      <div className="flex items-center gap-3">
                        <select className={`bg-transparent text-xs p-1 rounded border outline-none ${isDark ? "border-white/20 bg-[#1e1e1e]" : "border-black/20 bg-white"}`} value={newReview.rating} onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}>
                          {[5,4,3,2,1].map(num => <option key={num} value={num}>{num} Stars</option>)}
                        </select>
                        <button type="submit" className="ml-auto px-6 py-2 rounded-lg text-[10px] font-bold bg-green-600 text-white hover:bg-green-700 transition-colors">SUBMIT</button>
                      </div>
                    </form>
                  )}

                  <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar space-y-4">
                    {localReviews.map((rev, i) => (
                      <div key={i} className={`p-4 rounded-xl border ${isDark ? "bg-white/5 border-white/10" : "bg-gray-100 border-gray-200"}`}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-xs">{rev.reviewerName}</span>
                          <span className="text-yellow-500 text-[10px]">{"⭐".repeat(rev.rating)}</span>
                        </div>
                        <p className={`text-xs italic ${isDark ? "text-gray-300" : "text-gray-600"}`}>"{rev.comment}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Qty & Add to Cart */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-auto">
              <div className="flex items-center gap-4 border rounded-xl p-2 px-4 w-full sm:w-auto justify-between">
                <span className="font-bold text-xs uppercase opacity-60">Qty</span>
                <div className="flex items-center gap-4">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer hover:bg-black hover:text-white">-</button>
                  <span className="font-bold w-4 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer hover:bg-black hover:text-white">+</button>
                </div>
              </div>
              <button onClick={handleAddToCart} className={`w-full py-4 rounded-xl font-bold transition-all cursor-pointer shadow-lg active:scale-95 ${isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white"}`}>
                ADD TO CART
              </button>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t overflow-hidden">
            <h2 className="text-xl md:text-2xl font-bold mb-8 uppercase tracking-tight">You May Also Like</h2>
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={12}
              slidesPerView={2} 
              navigation={true} 
              pagination={{ clickable: true }}
              style={{ "--swiper-navigation-color": isDark ? "#fff" : "#000", "--swiper-pagination-color": isDark ? "#fff" : "#000" }}
              breakpoints={{ 
                640: { slidesPerView: 2 }, 
                768: { slidesPerView: 3 }, 
                1024: { slidesPerView: 4 } 
              }}
              className="product-swiper pb-14" 
            >
              {relatedProducts.map((rp) => (
                <SwiperSlide key={rp.id}>
                  <div onClick={() => navigate(`/products/${rp.id}`)} className={`group cursor-pointer p-3 md:p-4 rounded-2xl transition-all h-full border ${isDark ? "bg-[#252525] border-[#333] hover:border-white" : "bg-white border-gray-100 shadow-sm hover:shadow-lg"}`}>
                    <div className={`aspect-[3/4] rounded-lg overflow-hidden mb-4 flex items-center justify-center p-4 ${isDark ? "bg-white/5" : "bg-[#f9f9f9]"}`}>
                      <img src={rp.thumbnail} alt={rp.title} className="max-h-full w-full object-contain group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <h3 className="font-bold text-[12px] md:text-sm truncate mb-1 uppercase tracking-tighter">{rp.title}</h3>
                    <p className="font-bold text-sm">${rp.price.toFixed(2)}</p>
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