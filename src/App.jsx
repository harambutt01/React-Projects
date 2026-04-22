import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Counter from "./components/Counter.jsx";
import Toggle from "./components/toggle/Toggle.jsx";
import Input from "./components/Input";
import { ThemeProvider } from "./components/ThemeContext"; // ← sirf yeh badla

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider> {/* ← pehle ThemeContext.Provider tha, ab ThemeProvider hai */}

        <Navbar />

        <div style={{ marginLeft: "220px", padding: "20px" }}>
          <Routes>
            <Route path="/"          element={<Home />}      />
            <Route path="/about"     element={<About />}     />
            <Route path="/contact"   element={<Contact />}   />
            <Route path="/counter"   element={<Counter />}   />
            <Route path="/toggle"    element={<Toggle />}    />
            <Route path="/input"     element={<Input />}     />
          </Routes>
        </div>

      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;