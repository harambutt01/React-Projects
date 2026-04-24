import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import "./Navbar.css";

function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* ── Mobile/Tablet Header ── */}
      <div className="mobile-header">
        <h2 className="logo">MyWebsite</h2>
        <div className="mobile-controls">
          <button className="theme-btn" onClick={toggleTheme}>
            {isDark ? "☀️" : "🌙"}
          </button>
          <button className="hamburger" onClick={() => setMenuOpen((prev) => !prev)}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* ── Overlay ── */}
      {menuOpen && <div className="overlay" onClick={closeMenu} />}

      {/* ── Sidebar ── */}
      <nav className={`navbar ${menuOpen ? "open" : ""}`}>
        <button className="theme-btn" onClick={toggleTheme}>
          {isDark ? "☀️" : "🌙"}
        </button>

        <h2 className="logo">MyWebsite</h2>

        <ul className="nav-links">
          <li><Link to="/"         onClick={closeMenu}>Home</Link></li>
          <li><Link to="/about"    onClick={closeMenu}>About</Link></li>
          <li><Link to="/contact"  onClick={closeMenu}>Contact</Link></li>
          <li><Link to="/counter"  onClick={closeMenu}>Counter</Link></li>
          <li><Link to="/toggle"   onClick={closeMenu}>Toggle</Link></li>
          <li><Link to="/input"    onClick={closeMenu}>Input</Link></li>
          <li><Link to="/products" onClick={closeMenu}>Products</Link></li>
        </ul>
      </nav>
    </>
  );
}

export default Navbar;