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
import ProductList from "./components/products/ProductList.jsx";
import ProductDetail from "./components/products/ProductDetail.jsx";
import Cart from "./components/Cart.jsx"; 
import LoginSignup from "./LoginSignup.jsx"; 
import Wishlist from "./components/Wishlist.jsx"; 
import Checkout from "./components/Checkout.jsx";
import Payment from "./components/Payment";
import Shipping from './components/Shipping';
import PrivacyPolicy from './components/PrivacyPolicy';
import Returns from './components/Returns';
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
                <Route path="/"               element={<Home />}           />
                <Route path="/about"          element={<About />}          />
                <Route path="/contact"        element={<Contact />}        />
                <Route path="/counter"        element={<Counter />}        />
                <Route path="/products"       element={<ProductList />}    />
                <Route path="/products/:id"   element={<ProductDetail />}  />
                <Route path="/cart"           element={<Cart />}           />
                <Route path="/wishlist"       element={<Wishlist />}       />
                <Route path="/checkout"       element={<Checkout />} />
                <Route path="/login"          element={<LoginSignup />}    />
                <Route path="/payment"        element={<Payment />} />
                <Route path="/shipping"       element={<Shipping />} />
                <Route path="/privacy"        element={<PrivacyPolicy />} />
                <Route path="/returns" element={<Returns />} />
              </Routes>
            </main>

            <Footer />
          </div>

          <ToastContainer 
            position="top-right"      
            autoClose={2500} 
            theme="colored" 
            style={{ zIndex: 99999 }} 
          />
        </CartProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;