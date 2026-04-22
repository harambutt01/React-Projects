import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeContext";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Counter from "./components/Counter.jsx";
import Toggle from "./components/toggle/Toggle.jsx";
import Input from "./components/Input";
import ProductList from "./components/products/ProductList.jsx";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>

        <Navbar />

        <div className="main-content">
          <Routes>
            <Route path="/"         element={<Home />}        />
            <Route path="/about"    element={<About />}       />
            <Route path="/contact"  element={<Contact />}     />
            <Route path="/counter"  element={<Counter />}     />
            <Route path="/toggle"   element={<Toggle />}      />
            <Route path="/input"    element={<Input />}       />
            <Route path="/products" element={<ProductList />} />
          </Routes>
        </div>

      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;