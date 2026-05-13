import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './products/ProductCard';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Note: Make sure your backend actually handles these query params
      const response = await fetch('http://localhost:4000/api/products?page=1&limit=50');
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      
      // Safety: Check if data.products exists or if data itself is the array
      const productData = data.products || data || [];
      setProducts(productData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleExploreClick = () => {
    navigate('/products');
  };

  // Professional Tip: Use lowercase comparison to avoid mismatches
  const electronics = products
    .filter((p) => p.category?.toLowerCase() === "smartphones" || p.category?.toLowerCase() === "laptops")
    .slice(0, 4);

  const clothing = products
    .filter((p) => p.category?.toLowerCase() === "mens-shirts" || p.category?.toLowerCase() === "tops")
    .slice(0, 4);

  // Safety: beauty variable was missing in your code, adding it here
  const beauty = products
    .filter((p) => p.category?.toLowerCase() === "fragrances" || p.category?.toLowerCase() === "skincare")
    .slice(0, 4);

  return (
    <div className="bg-white dark:bg-[#0a0a0a] min-h-screen transition-colors duration-300">
      {/* Hero Section (Same as before) */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-black text-white px-4 py-20 text-center overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070')] bg-cover bg-center scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <h1 className="text-6xl sm:text-7xl md:text-[10rem] font-black italic uppercase tracking-tight leading-[0.9] mb-10">
            FASHION <br />
            <span className="text-transparent inline-block py-2" style={{ WebkitTextStroke: '1px #00bcd4' }}>MEETS</span> <br />
            GADGETS
          </h1>
          <button onClick={handleExploreClick} className="group relative border-2 border-[#00bcd4] text-[#00bcd4] px-10 py-4 font-black uppercase tracking-[5px] hover:bg-[#00bcd4] hover:text-black">
            Explore Drop
          </button>
        </div>
      </section>

      {/* Product Sections */}
      <section className="max-w-[1400px] mx-auto py-24 px-8">
        {loading ? (
          <div className="flex flex-col items-center py-20">
            <div className="w-12 h-12 border-4 border-[#00bcd4] border-t-transparent rounded-full animate-spin mb-4"></div>
            <span className="font-bold tracking-[5px] uppercase">Syncing API...</span>
          </div>
        ) : (
          <div className="space-y-32">
            <CategorySection title="New Arrival" tag="Latest Gadgets" items={electronics} id="new-arrivals" />
            <CategorySection title="Best Seller" tag="Trending Styles" items={clothing} id="best-sellers" isDark={true} />
            <CategorySection title="Clearance" tag="Exclusive Deals" items={beauty} id="clearance" isSale={true} />
          </div>
        )}
      </section>
    </div>
  );
}

function CategorySection({ title, tag, items, id, isDark, isSale }) {
  const navigate = useNavigate();

  // Yahan Safety Check: Agar items undefined hon ya khali hon toh crash na ho
  if (!items || items.length === 0) return null;

  return (
    <div id={id} className={`p-10 transition-all duration-500 ${isDark ? 'bg-black text-white' : 'bg-white text-black border border-gray-100'}`}>
      <div className="flex justify-between items-end mb-16 border-b pb-8">
        <div>
          <span className={`text-[9px] font-black uppercase tracking-[4px] ${isSale ? 'text-red-500' : 'text-[#00bcd4]'}`}>{tag}</span>
          <h2 className="text-4xl font-black italic uppercase">{title}</h2>
        </div>
        <button onClick={() => navigate('/products')} className="text-[11px] font-black uppercase tracking-[3px]">Explore →</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {items.map((product) => (
          // key={product.id} ensure karta hai ke React sahi element pick kare
          <ProductCard key={product?.id || Math.random()} product={product} isSale={isSale} />
        ))}
      </div>
    </div>
  );
}

export default Home;