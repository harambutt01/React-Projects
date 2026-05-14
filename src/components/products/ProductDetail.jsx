import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { useTheme } from "../ThemeContext";
import { useCart } from "../CartContext";
import useFetch from "../../hooks/useFetch";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { addToCart } = useCart();

  const { data: apiData, loading, error } = useFetch(`http://localhost:4000/api/products/${id}`);
  
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
    return `http://localhost:4000/${img}`;
  };

  const product = useMemo(() => {
    if (!apiData) return null;
    if (apiData.products && Array.isArray(apiData.products)) {
      return apiData.products.find((p) => p.id === parseInt(id));
    }
    if (Array.isArray(apiData)) return apiData[0];
    return apiData;
  }, [apiData, id]);

  const sortedReviews = useMemo(() => {
    return [...localReviews].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [localReviews]);

  // --- FETCH REVIEWS FROM DATABASE ---
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/products/${id}/reviews`);
        const data = await response.json();
        // Backend se { productId, reviews: [] } aa raha hai
        setLocalReviews(data.reviews || []);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      }
    };
    if (id) fetchReviews();
  }, [id]);

  // --- FETCH RELATED PRODUCTS ---
  useEffect(() => {
    if (product && product.category) {
      const fetchRelated = async () => {
        try {
          const response = await fetch(`http://localhost:4000/api/products/related/${product.category}/${id}`);
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
    window.scrollTo({ top: 0, behavior: "instant" });
    setQuantity(1);
    setActiveTab("details");
    setShowReviewForm(false);
    
    const mainImg = product.image || product.thumbnail || product.img_url;
    setSelectedImage(mainImg);
  }, [id, product]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.reviewerName.trim() || !newReview.comment.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/products/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      });

      if (response.ok) {
        // Refresh reviews list from DB
        const updatedData = await fetch(`http://localhost:4000/api/products/${id}/reviews`).then(res => res.json());
        setLocalReviews(updatedData.reviews || []);
        
        setNewReview({ reviewerName: "", comment: "", rating: 5 });
        setShowReviewForm(false);
        toast.success("Review saved to database!");
      }
    } catch (err) {
      toast.error("Failed to save review");
    }
  };

  // --- REST OF YOUR HANDLERS ---
  const handleImageSelect = (img) => setSelectedImage(img);
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
  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    toast.success(`${product.title || product.name} added to cart!`, { icon: "🛒" });
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
          <div className="flex flex-col gap-6">
            <div className={`rounded-2xl p-6 flex items-center justify-center min-h-[300px] md:min-h-[450px] ${imgBg}`}>
              <img src={displayImage(selectedImage)} alt={product.title || product.name} className="max-h-[280px] md:max-h-[400px] object-contain hover:scale-105 transition-all duration-500" />
            </div>
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
            <Swiper modules={[Navigation, Pagination]} spaceBetween={12} slidesPerView={1.3} navigation pagination={{ clickable: true }}
              breakpoints={{ 640: { slidesPerView: 2 }, 768: { slidesPerView: 3 }, 1024: { slidesPerView: 4 } }} className="product-swiper pb-14">
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