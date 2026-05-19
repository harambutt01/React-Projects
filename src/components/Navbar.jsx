import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { useTheme } from "./ThemeContext";
import { useCart } from "./CartContext";
import { toast } from "react-toastify"; 
import CartDrawer from "./CartDrawer";
import AnnouncementBar from "./AnnouncementBar"; 
import "./toggle/Toggle.css";

const STORAGE_KEY = "user_profile_status";

function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { totalItems, updateCartCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0); 
  const navigate = useNavigate();

  // 1. User State (Isse hum toggle control karenge)
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  // 2. Online Toggle State
  const [isOnline, setIsOnline] = useState(false);

  // LOGIC: Login/Logout ke sath toggle update karna
  const syncAuthState = useCallback(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    setUser(loggedInUser);
    
    // Agar user hai toh online (true), warna offline (false)
    setIsOnline(!!loggedInUser); 
  }, []);

  useEffect(() => {
    // Initial check on load
    syncAuthState();

    const syncData = () => {
      const savedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
      setWishlistCount(savedWishlist.length);
      if (typeof updateCartCount === 'function') {
        updateCartCount();
      }
    };

    syncData();

    // Listeners for Auth and Data changes
    window.addEventListener('authChange', syncAuthState); // Custom event for Login/Logout
    window.addEventListener('wishlistUpdate', syncData);
    window.addEventListener('cartUpdate', syncData);
    window.addEventListener('storage', syncData);

    return () => {
      window.removeEventListener('authChange', syncAuthState);
      window.removeEventListener('wishlistUpdate', syncData);
      window.removeEventListener('cartUpdate', syncData);
      window.removeEventListener('storage', syncData);
    };
  }, [updateCartCount, syncAuthState]); 

  // Logout Functionality
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChange")); 
    toast.error("Logged out successfully!", { theme: "colored" });
    setMenuOpen(false);
    navigate("/login");
  };

  const toggleStatus = useCallback(() => {
    if (user) {
      setIsOnline((prev) => !prev);
    } else {
      toast.warning("Please login first!", { theme: "colored", autoClose: 1000 });
    }
  }, [user]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-[1002]">
        <AnnouncementBar />
      </div>

      <header className="flex justify-between items-center px-[15px] sm:px-[25px] md:px-[40px] h-[64px] bg-[#222] text-white fixed top-[35px] left-0 w-full z-[1001] shadow-lg border-b border-white/5 transition-all">
        <div className="flex items-center gap-4 sm:gap-6">
          <button className="md:hidden bg-transparent border-none text-white p-0 cursor-pointer text-2xl" onClick={() => setMenuOpen(true)}>☰</button>
          <h2 className="text-lg md:text-xl font-bold tracking-tighter whitespace-nowrap italic uppercase cursor-pointer" onClick={() => navigate('/')}>Trendora</h2>
        </div>

        <nav className="hidden md:block">
          <ul className="flex list-none gap-6 lg:gap-8 m-0 p-0 items-center">
            <li><Link to="/" className="text-white no-underline text-[0.85rem] uppercase tracking-widest hover:text-[#00bcd4] transition-colors">Home</Link></li>
            <li><Link to="/products" className="text-white no-underline text-[0.85rem] uppercase tracking-widest hover:text-[#00bcd4] transition-colors">Product</Link></li>
            <li><Link to="/about" className="text-white no-underline text-[0.85rem] uppercase tracking-widest hover:text-[#00bcd4] transition-colors">About</Link></li>
            <li><Link to="/contact" className="text-white no-underline text-[0.85rem] uppercase tracking-widest hover:text-[#00bcd4] transition-colors">Contact</Link></li>
            <li><Link to="/dashboard" className="text-white no-underline text-[0.85rem] uppercase tracking-widest hover:text-[#00bcd4] transition-colors">Dashboard</Link></li>
            
            <li>
              {user ? (
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-1.5 rounded-md text-[0.8rem] uppercase font-bold tracking-widest hover:bg-red-600 transition-all shadow-md"
                >
                  Logout
                </button>
              ) : (
                <Link to="/login" className="bg-[#00bcd4] text-white px-4 py-1.5 rounded-md text-[0.8rem] uppercase font-bold tracking-widest hover:bg-[#0097a7] transition-all shadow-md">
                  Login
                </Link>
              )}
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-[15px] sm:gap-[20px]">
          <button 
            className={`w-[28px] h-[15px] sm:w-[30px] sm:h-[17px] rounded-full border-none cursor-pointer relative transition-all duration-300 ${isOnline ? "bg-[#00e5a0]" : "bg-[#cccccc]"}`} 
            onClick={toggleStatus}
          >
            <span className={`w-[10px] h-[10px] sm:w-[11px] sm:h-[11px] bg-white rounded-full absolute top-[2.5px] transition-all duration-300 ${isOnline ? "left-[15px] sm:left-[16px]" : "left-[3px]"}`} />
          </button>

          <button className="bg-transparent border-none text-white cursor-pointer text-base sm:text-lg hover:scale-110 transition-transform" onClick={toggleTheme}>
            {isDark ? "☀️" : "🌙"}
          </button>

          <button onClick={() => navigate('/wishlist')} className="relative bg-transparent border-none text-white cursor-pointer hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
            {wishlistCount > 0 && <span className="absolute -top-1.5 -right-2 bg-[#00bcd4] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#222]">{wishlistCount}</span>}
          </button>

          <button onClick={() => setCartOpen(true)} className="relative bg-transparent border-none text-white cursor-pointer hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            {totalItems > 0 && <span className="absolute -top-1.5 -right-2 bg-[#00bcd4] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#222]">{totalItems}</span>}
          </button>
        </div>
      </header>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Mobile Menu */}
      <nav className={`fixed top-0 h-screen w-[70%] sm:w-[280px] bg-[#222] text-white z-[2000] transition-all duration-300 p-6 flex flex-col shadow-2xl ${menuOpen ? "left-0" : "-left-full"}`}>
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
          <span className="font-bold text-lg italic uppercase">Trendora</span>
          <button className="bg-transparent text-white text-2xl" onClick={closeMenu}>✕</button>
        </div>
        <ul className="list-none p-0 flex flex-col gap-2">
          {["Home", "Products", "About", "Contact", "Dashboard"].map((item) => (
            <li key={item}>
              <Link to={item === "Home" ? "/" : `/${item.toLowerCase()}`} onClick={closeMenu} className="text-white no-underline text-[1.1rem] block px-4 py-3 rounded-lg hover:bg-[#00bcd4]/10 transition-all">{item}</Link>
            </li>
          ))}
          
          <li>
            {user ? (
              <button 
                onClick={handleLogout} 
                className="w-full text-red-500 font-bold no-underline text-[1.1rem] block px-4 py-3 border border-red-500 rounded-lg mt-4 text-center bg-transparent"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" onClick={closeMenu} className="text-[#00bcd4] font-bold no-underline text-[1.1rem] block px-4 py-3 border border-[#00bcd4] rounded-lg mt-4 text-center">
                Login / Sign Up
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Navbar;