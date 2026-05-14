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
      // Local backend API with 100 limit
      const response = await fetch('http://localhost:4000/api/products?pageSize=100');
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      
      // Supporting both array and object response from your backend
      setProducts(data.products || data || []);
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

  // Categories filtered based on your database names
  const electronics = products
    .filter((p) => p.category?.toLowerCase() === "electronics")
    .slice(0, 4);

  const clothing = products
    .filter((p) => p.category?.toLowerCase() === "fashion")
    .slice(0, 4);

  const beauty = products
    .filter((p) => p.category?.toLowerCase() === "cosmetics")
    .slice(0, 4);

  return (
    <div className="bg-white dark:bg-[#0a0a0a] min-h-screen transition-colors duration-300">

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-black text-white px-4 py-20 text-center overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070')] bg-cover bg-center scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <h4 className="text-[#00bcd4] text-[10px] md:text-[12px] font-bold tracking-[10px] md:tracking-[15px] uppercase mb-8">
            Tech • Trend • Timeless
          </h4>

          <h1 className="text-6xl sm:text-7xl md:text-[10rem] font-black italic uppercase tracking-tight leading-[0.9] mb-10">
            FASHION <br />
            <span className="text-transparent inline-block py-2" style={{ WebkitTextStroke: '1px #00bcd4' }}>MEETS</span> <br />
            GADGETS
          </h1>

          <p className="text-gray-300 text-[11px] md:text-[13px] max-w-2xl mx-auto font-medium tracking-[4px] uppercase leading-loose mb-12 opacity-80">
            From premium tech to curated apparel. <br className="hidden md:block" />
            Tailored by Trendora's AI.
          </p>

          <button
            onClick={handleExploreClick}
            className="group relative border-2 border-[#00bcd4] text-[#00bcd4] px-10 md:px-16 py-4 md:py-5 text-[11px] font-black uppercase tracking-[5px] overflow-hidden transition-all duration-500 hover:bg-[#00bcd4] hover:text-black shadow-[0_0_40px_rgba(0,188,212,0.2)]"
          >
            <span className="relative z-10">Explore Drop</span>
          </button>
        </div>
      </section>

      {/* Product Sections */}
      <section className="max-w-[1400px] mx-auto py-24 px-8 border-t border-gray-100 dark:border-white/5">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00bcd4] border-t-transparent rounded-full animate-spin mb-4"></div>
            <span className="text-[10px] font-bold tracking-[5px] uppercase">Syncing API...</span>
          </div>
        ) : (
          <div className="space-y-32">
            <CategorySection
              title="New Arrival"
              tag="Latest Gadgets"
              items={electronics}
              id="new-arrivals"
            />
            <CategorySection
              title="Best Seller"
              tag="Trending Styles"
              items={clothing}
              id="best-sellers"
              isDark={true}
            />
            <CategorySection
              title="Clearance Product"
              tag="Exclusive Deals"
              items={beauty}
              id="clearance"
              isSale={true}
            />
          </div>
        )}
      </section>
    </div>
  );
}

function CategorySection({ title, tag, items, id, isDark, isSale }) {
  const navigate = useNavigate();

  if (!items || items.length === 0) return null;

  const handleExploreClick = () => {
    navigate('/products');
  };

  return (
    <div id={id} className={`p-10 transition-all duration-500 ${isDark ? 'bg-black text-white shadow-2xl' : 'bg-white text-black'}`}>

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-current/10 pb-8 gap-4">
        <div>
          <span className={`text-[9px] font-black uppercase tracking-[4px] ${isSale ? 'text-red-500' : 'text-[#00bcd4]'}`}>
            {tag}
          </span>
          <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mt-2 leading-none">
            {title}
          </h2>
        </div>

        <button
          onClick={handleExploreClick}
          className={`text-[11px] font-black uppercase tracking-[3px] transition-all duration-300 flex items-center gap-2 group/link relative
            ${isDark ? 'text-[#00bcd4] hover:text-white' : 'text-black hover:text-[#00bcd4]'}`}
        >
          <span className="relative">
            Explore Drop
            <span className={`absolute -bottom-1 left-0 w-0 h-[2px] transition-all duration-300 group-hover/link:w-full ${isDark ? 'bg-white' : 'bg-[#00bcd4]'}`}></span>
          </span>
          <span className="group-hover/link:translate-x-2 transition-transform duration-300 text-lg">→</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {items.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isSale={isSale}
          />
        ))}
      </div>

      <div className="mt-12 md:mt-20 flex justify-center px-4">
        <button
          onClick={handleExploreClick}
          className={`group relative px-7 py-3.5 md:px-14 md:py-5 text-[10px] md:text-[11px] tracking-[2px] md:tracking-[4px] font-black uppercase border-2 overflow-hidden transition-all duration-500 active:scale-95
            ${isDark
              ? 'border-[#00bcd4] text-[#00bcd4] shadow-[0_0_15px_rgba(0,188,212,0.2)]'
              : 'border-black text-black'}`}
        >
          <span className={`absolute -inset-[2px] translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0 group-active:translate-y-0 ${isDark ? 'bg-[#00bcd4]' : 'bg-black'}`}></span>
          <span className={`relative z-10 transition-colors duration-500 ${isDark ? 'group-hover:text-black group-active:text-black' : 'group-hover:text-white group-active:text-white'}`}>
            See More Products
          </span>
        </button>
      </div>
    </div>
  );
}

export default Home;