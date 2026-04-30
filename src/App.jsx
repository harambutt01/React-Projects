import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeContext";
import { CartProvider } from "./components/CartContext";
import { ToastContainer } from "react-toastify"; // Step 1: Import Container
import "react-toastify/dist/ReactToastify.css"; // Step 2: Import CSS
import Navbar from "./components/Navbar";
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
          
          <Routes>
            <Route path="/"               element={<Home />}          />
            <Route path="/about"          element={<About />}         />
            <Route path="/contact"        element={<Contact />}       />
            <Route path="/counter"        element={<Counter />}       />
            <Route path="/dashboard"      element={<Dashboard />}      />
            <Route path="/products"       element={<ProductList />}   />
            <Route path="/products/:id"   element={<ProductDetail />} />
            <Route path="/cart"           element={<Cart />}          />
          </Routes>

          {/* 
              ToastContainer ko yahan rakha hai taake ye poori App mein 
              kahin se bhi call ho sake. Sizing aur colors auto-adjust honge.
          */}
          <ToastContainer 
            position="bottom-right" 
            autoClose={2500} 
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored" 
          />
          
        </CartProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;