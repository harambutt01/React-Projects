import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import { useCart } from "./CartContext";
import CartDrawer from "./CartDrawer";
import "./toggle/Toggle.css";

const STORAGE_KEY = "user_profile_status";

function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { totalItems } = useCart(); // CartContext se total items le rahe hain
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

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

  return (
    <>
      {/* Header: Height 64px fixed */}
      <header className="flex justify-between items-center px-[15px] sm:px-[25px] md:px-[40px] h-[64px] bg-[#222] text-white fixed top-0 left-0 w-full z-[1001] shadow-lg">
        
        <div className="flex items-center gap-4 sm:gap-6 md:gap-10">
          <h2 className="text-lg md:text-xl font-bold tracking-tighter whitespace-nowrap">MyWebsite</h2>

          {/* Desktop Menu (768px+) */}
          <ul className="hidden md:flex list-none gap-5 m-0 p-0 items-center">
            <li><Link to="/" className="text-white no-underline text-[0.95rem] hover:text-[#00bcd4] transition-colors duration-300">Home</Link></li>
            <li><Link to="/about" className="text-white no-underline text-[0.95rem] hover:text-[#00bcd4] transition-colors duration-300">About</Link></li>
            <li><Link to="/contact" className="text-white no-underline text-[0.95rem] hover:text-[#00bcd4] transition-colors duration-300">Contact</Link></li>
            <li><Link to="/counter" className="text-white no-underline text-[0.95rem] hover:text-[#00bcd4] transition-colors duration-300">Counter</Link></li>
            <li><Link to="/dashboard" className="text-white no-underline text-[0.95rem] hover:text-[#00bcd4] transition-colors duration-300">Dashboard</Link></li>
            <li><Link to="/products" className="text-white no-underline text-[0.95rem] hover:text-[#00bcd4] transition-colors duration-300">Products</Link></li>
            
            {/* Desktop Cart Route Link */}
            <li>
              <Link to="/cart" className="text-white no-underline text-[0.95rem] hover:text-[#00bcd4] flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full transition-all">
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

        {/* Right Side Actions (Mobile & Icons) */}
        <div className="flex items-center gap-[10px] sm:gap-[15px]">

          {/* Status Toggle */}
          <button
            className={`w-[28px] h-[15px] sm:w-[30px] sm:h-[17px] rounded-full border-none cursor-pointer relative transition-all duration-300 p-0
              ${isOnline ? "bg-[#00e5a0]" : "bg-[#cccccc]"}`}
            onClick={toggleStatus}>
            <span className={`w-[10px] h-[10px] sm:w-[11px] sm:h-[11px] bg-white rounded-full absolute top-[2.5px] sm:top-[3px] transition-all duration-300
              ${isOnline ? "left-[15px] sm:left-[16px]" : "left-[3px]"}`} />
          </button>

          {/* Theme Button */}
          <button
            className="bg-transparent border-none text-white cursor-pointer text-base sm:text-lg p-0 hover:scale-110 transition-transform"
            onClick={toggleTheme}>
            {isDark ? "☀️" : "🌙"}
          </button>

          {/* Cart Icon: Only triggers Drawer on Mobile (< 768px) */}
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

          {/* Hamburger Menu (Mobile Only) */}
          <button
            className="md:hidden bg-transparent border border-white/20 text-white px-2 py-1 rounded cursor-pointer text-lg"
            onClick={() => setMenuOpen(true)}>
            ☰
          </button>
        </div>
      </header>

      {/* Side Menu Overlay */}
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
          {/* Mobile Menu mein Cart Page ka link bhi de sakte hain */}
          <li>
            <Link to="/cart" onClick={closeMenu} className="text-white no-underline text-[1.1rem] block px-4 py-3 rounded-lg hover:bg-[#00bcd4]/10 hover:text-[#00bcd4]">
              Cart ({totalItems})
            </Link>
          </li>
        </ul>
      </nav>

      {/* Cart Drawer Component (Side Slide) */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

export default Navbar;