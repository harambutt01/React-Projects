import { Link } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import "./Navbar.css";

function Navbar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <div className="theme-btn-wrapper">
    <button onClick={toggleTheme} className="theme-btn">
      {isDark ? "☀️" : "🌙"}
    </button>
  </div>
      <h2 className="logo">MyWebsite</h2>

    

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/counter">Counter</Link></li>
        <li><Link to="/toggle">Toggle</Link></li>
        <li><Link to="/input">Input</Link></li>
        <li><Link to="/useeffect">UseEffect</Link></li>
      </ul>

    </nav>
  );
}

export default Navbar;