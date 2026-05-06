import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { useTheme } from "./ThemeContext";
import { useCart } from "./CartContext";
import CartDrawer from "./CartDrawer";
import "./toggle/Toggle.css";

const STORAGE_KEY = "user_profile_status";

function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  
  // --- Search States ---
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const [isOnline, setIsOnline] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(isOnline));
  }, [isOnline]);

  const toggleStatus = useCallback(() => {
    setIsOnline((prev) => !prev);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  // Search Submit Handler
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header className="flex justify-between items-center px-[15px] sm:px-[25px] md:px-[40px] h-[64px] bg-[#222] text-white fixed top-0 left-0 w-full z-[1001] shadow-lg">
        
        <div className="flex items-center gap-4 sm:gap-6 md:gap-10">
          <h2 className="text-lg md:text-xl font-bold tracking-tighter whitespace-nowrap">MyWebsite</h2>

          <ul className="hidden md:flex list-none gap-5 m-0 p-0 items-center">
            <li><Link to="/" className="text-white no-underline text-[0.95rem] hover:text-[#00bcd4] transition-colors duration-300">Home</Link></li>
            <li><Link to="/about" className="text-white no-underline text-[0.95rem] hover:text-[#00bcd4] transition-colors duration-300">About</Link></li>
            <li><Link to="/contact" className="text-white no-underline text-[0.95rem] hover:text-[#00bcd4] transition-colors duration-300">Contact</Link></li>
            <li><Link to="/counter" className="text-white no-underline text-[0.95rem] hover:text-[#00bcd4] transition-colors duration-300">Counter</Link></li>
            <li><Link to="/dashboard" className="text-white no-underline text-[0.95rem] hover:text-[#00bcd4] transition-colors duration-300">Dashboard</Link></li>
            <li><Link to="/products" className="text-white no-underline text-[0.95rem] hover:text-[#00bcd4] transition-colors duration-300">Products</Link></li>
            
            <li>
              {/* FIXED: 'bg-white/5' ko remove kiya gaya hai taake shadow box khatam ho jaye */}
              <Link to="/cart" className="text-white no-underline text-[0.95rem] hover:text-[#00bcd4] flex items-center gap-2 px-3 py-1 transition-all">
                Cart
                {totalItems > 0 && (
                  <span className="bg-[#00bcd4] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-[10px] sm:gap-[20px]">
          
          <button 
            onClick={() => setSearchOpen(true)}
            className="bg-transparent border-none text-white cursor-pointer hover:scale-110 transition-transform flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>

          <button
            className={`w-[28px] h-[15px] sm:w-[30px] sm:h-[17px] rounded-full border-none cursor-pointer relative transition-all duration-300 p-0
              ${isOnline ? "bg-[#00e5a0]" : "bg-[#cccccc]"}`}
            onClick={toggleStatus}>
            <span className={`w-[10px] h-[10px] sm:w-[11px] sm:h-[11px] bg-white rounded-full absolute top-[2.5px] sm:top-[3px] transition-all duration-300
              ${isOnline ? "left-[15px] sm:left-[16px]" : "left-[3px]"}`} />
          </button>

          <button
            className="bg-transparent border-none text-white cursor-pointer text-base sm:text-lg p-0 hover:scale-110 transition-transform"
            onClick={toggleTheme}>
            {isDark ? "☀️" : "🌙"}
          </button>

          <button
            onClick={() => setCartOpen(true)}
            className="md:hidden relative text-white text-lg sm:text-xl bg-transparent border-none cursor-pointer p-0 hover:scale-110 transition-transform">
            🛒
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          <button
            className="md:hidden bg-transparent border border-white/20 text-white px-2 py-1 rounded cursor-pointer text-lg"
            onClick={() => setMenuOpen(true)}>
            ☰
          </button>
        </div>
      </header>

      {/* --- SAPPHIRE STYLE SEARCH SIDE DRAWER --- */}
      <div 
        className={`fixed inset-0 bg-black/60 z-[2001] transition-opacity duration-300 backdrop-blur-[2px] ${searchOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} 
        onClick={() => setSearchOpen(false)} 
      />
      
      <div className={`fixed top-0 right-0 h-screen w-full sm:w-[400px] bg-white text-black z-[2002] transition-transform duration-500 flex flex-col p-6 shadow-2xl ${searchOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex justify-between items-center mb-8">
          <span className="font-bold tracking-widest uppercase text-sm">Search</span>
          <button className="bg-transparent border-none text-2xl cursor-pointer" onClick={() => setSearchOpen(false)}>✕</button>
        </div>

        <form onSubmit={handleSearch} className="relative border-b border-gray-300 pb-2">
          <input 
            autoFocus
            type="text" 
            placeholder="Search our store..." 
            className="w-full bg-transparent border-none py-2 text-sm outline-none tracking-wider uppercase"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="absolute right-0 top-2 bg-transparent border-none opacity-50 hover:opacity-100 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
        </form>

        <div className="mt-10">
          <h4 className="text-[10px] font-black tracking-widest text-gray-400 uppercase mb-4">Quick Links</h4>
          <ul className="list-none p-0 space-y-4">
            {["New Arrivals", "Best Sellers", "Clearance"].map(link => (
                <li key={link}>
                    <Link to="/products" onClick={() => setSearchOpen(false)} className="text-black no-underline text-sm font-medium hover:text-[#00bcd4] transition-colors uppercase tracking-widest">{link}</Link>
                </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Side Menu Overlay (Mobile) */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/60 z-[1999] backdrop-blur-[2px]" onClick={closeMenu} />
      )}

      {/* Side Navbar (Mobile Menu Drawer) */}
      <nav className={`fixed top-0 h-screen w-[70%] sm:w-[280px] bg-[#222] text-white z-[2000] transition-all duration-300 p-6 flex flex-col shadow-2xl
        ${menuOpen ? "left-0" : "-left-full"}`}>

        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
          <span className="font-bold text-lg">MENU</span>
          <button className="bg-transparent border-none text-white text-2xl" onClick={closeMenu}>✕</button>
        </div>

        <ul className="list-none p-0 flex flex-col gap-2">
          {["Home", "About", "Contact", "Counter", "Dashboard", "Products"].map((item) => (
            <li key={item}>
              <Link 
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`} 
                onClick={closeMenu} 
                className="text-white no-underline text-[1.1rem] block px-4 py-3 rounded-lg hover:bg-[#00bcd4]/10 hover:text-[#00bcd4] transition-all">
                {item}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/cart" onClick={closeMenu} className="text-white no-underline text-[1.1rem] block px-4 py-3 rounded-lg hover:bg-[#00bcd4]/10 hover:text-[#00bcd4]">
              Cart ({totalItems})
            </Link>
          </li>
        </ul>
      </nav>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

export default Navbar;