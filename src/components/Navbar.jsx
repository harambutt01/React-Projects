import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import "./Navbar.css";
import "./toggle/Toggle.css";

const STORAGE_KEY = "user_profile_status";

function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

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
      <header className="mobile-header">
        <div className="nav-left-group">
          <h2 className="logo">MyWebsite</h2>
          
          <ul className="nav-links">
            <li><Link to="/" onClick={closeMenu}>Home</Link></li>
            <li><Link to="/about" onClick={closeMenu}>About</Link></li>
            <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>
            <li><Link to="/counter" onClick={closeMenu}>Counter</Link></li>
            <li><Link to="/dashboard" onClick={closeMenu}>Dashboard</Link></li>
            <li><Link to="/products" onClick={closeMenu}>Products</Link></li>
          </ul>
        </div>

        <div className="mobile-controls">
          <button
            className={`toggle-switch ${isOnline ? "toggle-on" : "toggle-off"}`}
            onClick={toggleStatus}
          >
            <span className="toggle-thumb" />
          </button>

          <button className="theme-btn" onClick={toggleTheme}>
            {isDark ? "☀️" : "🌙"}
          </button>

          <button className="hamburger" onClick={() => setMenuOpen(true)}>
            ☰
          </button>
        </div>
      </header>

      {menuOpen && <div className="overlay" onClick={closeMenu} />}

      {/* ── Side Menu (Updated) ── */}
      <nav className={`side-navbar ${menuOpen ? "open" : ""}`}>
        <div className="side-navbar-top">
           {/* Logo yahan se hata diya gaya hai */}
           <button className="close-btn" onClick={closeMenu}>✕</button>
        </div>

        <ul className="side-nav-links">
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/about" onClick={closeMenu}>About</Link></li>
          <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>
          <li><Link to="/counter" onClick={closeMenu}>Counter</Link></li>
          <li><Link to="/dashboard" onClick={closeMenu}>Dashboard</Link></li>
          <li><Link to="/products" onClick={closeMenu}>Products</Link></li>
        </ul>
      </nav>
    </>
  );
}

export default Navbar;