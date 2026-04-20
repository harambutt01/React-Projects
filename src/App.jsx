import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Counter from "./components/Counter.jsx";
import Toggle from "./components/toggle/Toggle.jsx";
import Input from "./components/Input";
import UseEffect from "./components/UseEffect";

import { ThemeContext } from "./components/ThemeContext";

function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.style.background = theme === "light" ? "#ffffff" : "#1e1e1e";
    document.body.style.color = theme === "light" ? "#000" : "#fff";
  }, [theme]);

  return (
    <BrowserRouter>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        
        <Navbar />

        <div style={{ marginLeft: "220px", padding: "20px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/counter" element={<Counter />} />
            <Route path="/toggle" element={<Toggle />} />
            <Route path="/input" element={<Input />} />
            <Route path="/useeffect" element={<UseEffect />} />
          </Routes>
        </div>

      </ThemeContext.Provider>
    </BrowserRouter>
  );
}

export default App;