import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeContext";
import { CartProvider } from "./components/CartContext";
import { ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; 
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Counter from "./components/Counter.jsx";
import Dashboard from "./components/Dashboard.jsx";
import ProductList from "./components/products/ProductList.jsx";
import ProductDetail from "./components/products/ProductDetail.jsx";
import Cart from "./components/Cart.jsx"; 

import "./components/toggle/Toggle.css";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <CartProvider>
          <Navbar />
          
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow pt-[64px]"> 
              <Routes>
                <Route path="/"             element={<Home />}          />
                <Route path="/about"          element={<About />}         />
                <Route path="/contact"        element={<Contact />}       />
                <Route path="/counter"        element={<Counter />}       />
                <Route path="/dashboard"      element={<Dashboard />}      />
                <Route path="/products"       element={<ProductList />}   />
                <Route path="/products/:id"   element={<ProductDetail />} />
                <Route path="/cart"           element={<Cart />}          />
              </Routes>
            </main>

            <Footer />
          </div>

          <ToastContainer 
            position="top-right"      
            autoClose={2500} 
            theme="colored" 
          />
        </CartProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;