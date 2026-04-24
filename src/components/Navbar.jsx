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
      
      <div className="mobile-header">
        <h2 className="logo">MyWebsite</h2>
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
          <button className="hamburger" onClick={() => setMenuOpen((prev) => !prev)}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

   
      {menuOpen && <div className="overlay" onClick={closeMenu} />}

     
      <nav className={`navbar ${menuOpen ? "open" : ""}`}>

        
        <div className="navbar-top">
          <button className="theme-btn" onClick={toggleTheme}>
            {isDark ? "☀️" : "🌙"}
          </button>

          <div className="avatar-toggle-wrapper">

            {/* ── Avatar — future use k liye commented ── */}
            {/* <div className="avatar-wrapper">
              <svg
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="avatar-svg"
                style={{ color: isDark ? "#aaaaaa" : "#000000" }}
              >
                <circle cx="32" cy="24" r="12" fill="currentColor" opacity="0.9" />
                <path
                  d="M8 56c0-13.255 10.745-24 24-24s24 10.745 24 24"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.9"
                />
              </svg>
              <span className={`avatar-dot ${isOnline ? "dot-online" : "dot-offline"}`} />
            </div> */}

            <button
              className={`toggle-switch ${isOnline ? "toggle-on" : "toggle-off"}`}
              onClick={toggleStatus}
            >
              <span className="toggle-thumb" />
            </button>
          </div>
        </div>

       
        <h2 className="logo">MyWebsite</h2>

     
        <ul className="nav-links">
          <li><Link to="/"          onClick={closeMenu}>Home</Link></li>
          <li><Link to="/about"     onClick={closeMenu}>About</Link></li>
          <li><Link to="/contact"   onClick={closeMenu}>Contact</Link></li>
          <li><Link to="/counter"   onClick={closeMenu}>Counter</Link></li>
          <li><Link to="/dashboard" onClick={closeMenu}>Dashboard</Link></li>
          <li><Link to="/products"  onClick={closeMenu}>Products</Link></li>
        </ul>

      </nav>
    </>
  );
}

export default Navbar;