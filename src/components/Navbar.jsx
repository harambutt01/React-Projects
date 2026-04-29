import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
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
      {/* Desktop Header */}
      <header className="flex justify-between items-center px-[40px] h-[64px] bg-[#222] text-white fixed top-0 left-0 w-full z-[1]">

        <div className="flex items-center gap-10">
          <h2 className="text-xl font-bold">MyWebsite</h2>

          <ul className="hidden md:flex list-none gap-5 m-0 p-0">
            <li><Link to="/" className="text-white no-underline text-[0.95rem] hover:text-[#00bcd4] transition-colors duration-300">Home</Link></li>
            <li><Link to="/about" className="text-white no-underline text-[0.95rem] hover:text-[#00bcd4] transition-colors duration-300">About</Link></li>
            <li><Link to="/contact" className="text-white no-underline text-[0.95rem] hover:text-[#00bcd4] transition-colors duration-300">Contact</Link></li>
            <li><Link to="/counter" className="text-white no-underline text-[0.95rem] hover:text-[#00bcd4] transition-colors duration-300">Counter</Link></li>
            <li><Link to="/dashboard" className="text-white no-underline text-[0.95rem] hover:text-[#00bcd4] transition-colors duration-300">Dashboard</Link></li>
            <li><Link to="/products" className="text-white no-underline text-[0.95rem] hover:text-[#00bcd4] transition-colors duration-300">Products</Link></li>
          </ul>
        </div>

        <div className="flex items-center gap-[4px]">

          {/* Toggle Status */}
          <button
            className={`w-[30px] h-[17px] rounded-full border-none cursor-pointer relative transition-all duration-300 p-0
              ${isOnline ? "bg-[#00e5a0]" : "bg-[#cccccc]"}`}
            onClick={toggleStatus}>
            <span className={`w-[11px] h-[11px] bg-white rounded-full absolute top-[3px] transition-all duration-300
              ${isOnline ? "left-[16px]" : "left-[3px]"}`} />
          </button>

          {/* Theme Button */}
          <button
            className="bg-transparent border-none text-white cursor-pointer text-lg p-0"
            onClick={toggleTheme}>
            {isDark ? "☀️" : "🌙"}
          </button>

          {/* Cart Button - mobile mn bhi navbar mn dikhega, hamburger se pehle */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative text-white text-xl bg-transparent border-none cursor-pointer p-0">
            🛒
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[0.65rem] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {/* Hamburger */}
          <button
            className="md:hidden bg-transparent border border-white/30 text-white px-3 py-1 rounded cursor-pointer text-xl"
            onClick={() => setMenuOpen(true)}>
            ☰
          </button>
        </div>
      </header>

      {/* Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/60 z-[1]" onClick={closeMenu} />
      )}

      {/* Side Navbar - Cart item hataya */}
      <nav className={`fixed top-0 h-screen w-[280px] bg-[#222] text-white z-[2000] transition-all duration-300 p-5 flex flex-col
        ${menuOpen ? "left-0" : "-left-[280px]"}`}>

        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-3">
          <button
            className="bg-transparent border-none text-white text-2xl cursor-pointer"
            onClick={closeMenu}>
            ✕
          </button>
        </div>

        <ul className="list-none p-0">
          <li className="mb-4"><Link to="/" onClick={closeMenu} className="text-white no-underline text-[1.1rem] block px-3 py-2 rounded-md hover:bg-white/10 hover:text-[#00bcd4] transition-all duration-200">Home</Link></li>
          <li className="mb-4"><Link to="/about" onClick={closeMenu} className="text-white no-underline text-[1.1rem] block px-3 py-2 rounded-md hover:bg-white/10 hover:text-[#00bcd4] transition-all duration-200">About</Link></li>
          <li className="mb-4"><Link to="/contact" onClick={closeMenu} className="text-white no-underline text-[1.1rem] block px-3 py-2 rounded-md hover:bg-white/10 hover:text-[#00bcd4] transition-all duration-200">Contact</Link></li>
          <li className="mb-4"><Link to="/counter" onClick={closeMenu} className="text-white no-underline text-[1.1rem] block px-3 py-2 rounded-md hover:bg-white/10 hover:text-[#00bcd4] transition-all duration-200">Counter</Link></li>
          <li className="mb-4"><Link to="/dashboard" onClick={closeMenu} className="text-white no-underline text-[1.1rem] block px-3 py-2 rounded-md hover:bg-white/10 hover:text-[#00bcd4] transition-all duration-200">Dashboard</Link></li>
          <li className="mb-4"><Link to="/products" onClick={closeMenu} className="text-white no-underline text-[1.1rem] block px-3 py-2 rounded-md hover:bg-white/10 hover:text-[#00bcd4] transition-all duration-200">Products</Link></li>
        </ul>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

export default Navbar;