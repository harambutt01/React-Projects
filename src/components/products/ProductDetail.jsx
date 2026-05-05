import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "../ThemeContext";
import { useCart } from "../CartContext";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';

// ---  Review Card (Using Props) ---
const ReviewCard = ({ review, isDark }) => (
  <div className={`p-3 rounded-xl border ${isDark ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-50"}`}>
    <div className="flex justify-between font-bold text-xs mb-1">
      <span>{review.reviewerName}</span>
      <span className="text-yellow-500">{"⭐".repeat(review.rating)}</span>
    </div>
    <p className="text-xs italic opacity-70">"{review.comment}"</p>
  </div>
);

// ---  Related Product Card (Using Props) ---
const RelatedCard = ({ item, isDark, onClick }) => (
  <div onClick={onClick} className={`cursor-pointer p-4 rounded-2xl border transition-all h-full ${isDark ? "bg-[#252525] border-[#333] hover:border-white" : "bg-white border-gray-100 shadow-sm hover:shadow-lg"}`}>
    <img src={item.thumbnail} alt={item.title} className="h-32 w-full object-contain mb-3" />
    <h3 className="font-bold text-xs truncate uppercase">{item.title}</h3>
    <p className="font-bold text-sm">${item.price.toFixed(2)}</p>
  </div>
);

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [localReviews, setLocalReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState("details");

  // ---  Async Fetching ---
  const loadProductData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://dummyjson.com/products?limit=0`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: Failed to connect to server.`);
      }

      const data = await response.json();
      const found = data.products.find((p) => p.id === parseInt(id));

      if (found) {
        setProduct(found);
        setSelectedImage(found.thumbnail);
        
        // Handling reviews
        const saved = localStorage.getItem(`reviews_prod_${id}`);
        setLocalReviews(saved ? JSON.parse(saved) : (found.reviews || []));

        // Handling related items
        const filtered = data.products.filter(p => p.category === found.category && p.id !== found.id);
        setRelatedProducts(filtered.slice(0, 8));
      } else {
        setError("Product not found.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    loadProductData();
  }, [id]);

  if (loading) return <div className="pt-40 text-center font-bold">Loading...</div>;
  if (error) return <div className="pt-40 text-center text-red-500">{error}</div>;
  if (!product) return null;

  return (
    <div className={`pt-24 pb-12 px-4 min-h-screen ${isDark ? "bg-[#121212] text-white" : "bg-gray-50 text-black"}`}>
      <div className={`mx-auto max-w-6xl p-6 md:p-10 rounded-2xl border ${isDark ? "bg-[#1e1e1e] border-[#333]" : "bg-white border-gray-100 shadow-sm"}`}>
        
        <button onClick={() => navigate("/products")} className="mb-6 font-bold text-sm opacity-70 hover:opacity-100">
          ← BACK TO SHOP
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Images Section */}
          <div className="space-y-6">
            <div className={`rounded-2xl p-6 flex items-center justify-center min-h-[400px] ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
              <img src={selectedImage} alt={product.title} className="max-h-[400px] object-contain" />
            </div>
          </div>

          {/* Info Section */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            <p className="text-2xl font-black mb-8">${product.price.toFixed(2)}</p>

            {/* Tab Navigation */}
            <div className="flex gap-6 border-b mb-6">
              {["details", "description", "reviews"].map((tab) => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-xs font-bold uppercase ${activeTab === tab ? "border-b-2 border-current" : "opacity-40"}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content using Props */}
            <div className="min-h-[200px]">
              {activeTab === "details" && (
                <div className="space-y-2 opacity-80 text-sm">
                  <p><b>Brand:</b> {product.brand}</p>
                  <p><b>Stock:</b> {product.stock} left</p>
                </div>
              )}
              {activeTab === "description" && <p className="text-sm opacity-80 leading-relaxed">{product.description}</p>}
              {activeTab === "reviews" && (
                <div className="space-y-4">
                  {localReviews.map((rev, index) => (
                    <ReviewCard key={index} review={rev} isDark={isDark} /> // Passing Props
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={() => {
                addToCart(product, 1);
                toast.success("Added to cart!");
              }}
              className={`mt-auto py-4 rounded-xl font-bold ${isDark ? "bg-white text-black" : "bg-black text-white"}`}
            >
              ADD TO CART
            </button>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-20 pt-10 border-t">
          <h2 className="text-xl font-bold mb-8 uppercase">Related Products</h2>
          <Swiper spaceBetween={15} slidesPerView={1.3} breakpoints={{ 768: { slidesPerView: 4 } }}>
            {relatedProducts.map((item) => (
              <SwiperSlide key={item.id}>
                <RelatedCard 
                  item={item} 
                  isDark={isDark} 
                  onClick={() => navigate(`/products/${item.id}`)} 
                /> 
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;