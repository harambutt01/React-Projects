import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTheme } from "./ThemeContext";
import { getNames } from "country-list";
import { API_BASE_URL } from '../Config/Api';


function Checkout() {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  const [shipping, setShipping] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Pakistan", 
  });

  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const countryRef = useRef(null);
  const paymentRef = useRef(null);

  const countries = getNames();
  const paymentMethods = ["Cash on Delivery", "Online Payment"];

  useEffect(() => {
    const stagedItems = JSON.parse(localStorage.getItem("checkout_staging"));
    if (stagedItems && stagedItems.length > 0) {
      setCartItems(stagedItems);
      const sum = stagedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      setTotal(sum);
    } else {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      if (savedCart.length === 0) {
        navigate("/");
        return;
      }
      setCartItems(savedCart);
      const sum = savedCart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      setTotal(sum);
    }

    const handleClickOutside = (event) => {
      if (countryRef.current && !countryRef.current.contains(event.target)) setIsCountryOpen(false);
      if (paymentRef.current && !paymentRef.current.contains(event.target)) setIsPaymentOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [navigate]);

  const handleInput = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const currentUserId = 2; 

    const orderPayload = {
      user_id: currentUserId,
      cartItems: cartItems.map(item => ({
        product_id: item.id || item.product_id,
        quantity: item.quantity,
        price: item.price,
        category: item.category || 'General'
      })),
      shipping: shipping,
      paymentMethod: paymentMethod,
      total: total 
    };

    if (paymentMethod === "Online Payment") {
      navigate("/payment", { state: { orderPayload } });
      return; 
    }

    try {
      const response = await fetch(`${API_BASE_URL}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(`🎉 Order Placed! ID: ${result.orderId}`);
        const orderedProductIds = cartItems.map(item => item.id || item.product_id);
        const fullCart = JSON.parse(localStorage.getItem("cart")) || [];
        const remainingCartItems = fullCart.filter(item => !orderedProductIds.includes(item.id));
        
        localStorage.setItem("cart", JSON.stringify(remainingCartItems));
        localStorage.removeItem("checkout_staging"); 
        
        window.dispatchEvent(new Event("cartUpdate")); 
        navigate("/"); 
      } else {
        toast.error(result.error || "Order failed!");
      }
    } catch (err) {
      console.error("Checkout Error:", err);
      toast.error("Server connection error!");
    }
  };

  return (
    <div className={`min-h-screen w-full px-3 py-6 md:p-10 box-border overflow-x-hidden ${isDark ? "bg-[#121212] text-white" : "bg-gray-100 text-black"}`}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.8fr,1fr] gap-6 md:gap-8 w-full box-border">
        
        {/* FORM SECTION */}
        <div className={`p-4 sm:p-6 rounded-2xl shadow-md h-full w-full max-w-full min-w-0 box-border ${isDark ? "bg-[#1e1e1e] border border-gray-800" : "bg-white border border-gray-200"}`}>
          <h2 className="text-xl sm:text-2xl font-bold mb-6 border-b pb-2">Shipping Information</h2>
          <form onSubmit={handlePlaceOrder} className="space-y-4 w-full min-w-0 block box-border">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <input type="text" name="name" placeholder="Full Name" required onChange={handleInput} className="p-3 rounded-lg border bg-transparent w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#00bcd4] box-border" />
              <input type="email" name="email" placeholder="Email (Optional)" onChange={handleInput} className="p-3 rounded-lg border bg-transparent w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#00bcd4] box-border" />
            </div>
            
            <input type="text" name="address" placeholder="Complete Street Address" required onChange={handleInput} className="p-3 rounded-lg border bg-transparent w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#00bcd4] box-border" />
            
            {/* CITY & POSTAL CODE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <input type="text" name="city" placeholder="City" required onChange={handleInput} className="p-3 rounded-lg border bg-transparent w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#00bcd4] box-border" />
              <input type="text" name="postalCode" placeholder="Postal Code" required onChange={handleInput} className="p-3 rounded-lg border bg-transparent w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#00bcd4] box-border" />
            </div>
            
            {/* COUNTRY DROPDOWN (FULL WIDTH) */}
            <div ref={countryRef} className="relative w-full text-sm select-none">
              <div 
                onClick={() => setIsCountryOpen(!isCountryOpen)}
                className={`p-3 rounded-lg border w-full flex justify-between items-center cursor-pointer transition-all duration-200 ${
                  isDark ? "border-gray-700 bg-transparent text-white" : "border-gray-300 bg-white text-black"
                } ${isCountryOpen ? "ring-2 ring-[#00bcd4] border-transparent" : ""}`}
              >
                <span className="truncate">{shipping.country}</span>
                <span className="text-[10px] opacity-70 transition-transform duration-200" style={{ transform: isCountryOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
              </div>
              {isCountryOpen && (
                <div className={`absolute z-50 left-0 right-0 mt-1 rounded-lg border shadow-xl max-h-60 overflow-y-auto w-full ${isDark ? "bg-[#1e1e1e] border-gray-800 text-white" : "bg-white border-gray-200 text-black"}`}>
                  {countries.map((c) => (
                    <div 
                      key={c}
                      onClick={() => {
                        setShipping({ ...shipping, country: c });
                        setIsCountryOpen(false);
                      }}
                      className={`p-3 cursor-pointer text-sm truncate ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
                    >
                      {c}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* PAYMENT METHOD */}
            <div className="w-full min-w-0 block box-border">
              <h2 className="text-lg sm:text-xl font-bold mt-6 mb-4">Payment Method</h2>
              <div ref={paymentRef} className="relative w-full text-sm select-none">
                <div 
                  onClick={() => setIsPaymentOpen(!isPaymentOpen)}
                  className={`p-3 rounded-lg border w-full flex justify-between items-center cursor-pointer transition-all duration-200 ${
                    isDark ? "border-gray-700 bg-transparent text-white" : "border-gray-300 bg-white text-black"
                  } ${isPaymentOpen ? "ring-2 ring-[#00bcd4] border-transparent" : ""}`}
                >
                  <span className="truncate">{paymentMethod}</span>
                  <span className="text-[10px] opacity-70 transition-transform duration-200" style={{ transform: isPaymentOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
                </div>
                {isPaymentOpen && (
                  <div className={`absolute z-50 left-0 right-0 mt-1 rounded-lg border shadow-xl w-full ${isDark ? "bg-[#1e1e1e] border-gray-800 text-white" : "bg-white border-gray-200 text-black"}`}>
                    {paymentMethods.map((pm) => (
                      <div 
                        key={pm}
                        onClick={() => {
                          setPaymentMethod(pm);
                          setIsPaymentOpen(false);
                        }}
                        className={`p-3 cursor-pointer text-sm truncate ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
                      >
                        {pm}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full max-w-full py-3.5 mt-6 bg-[#00bcd4] text-black font-black rounded-xl hover:opacity-80 transition-all uppercase tracking-widest shadow-lg text-sm box-border block"
            >
              {paymentMethod === "Online Payment" ? "Proceed to Payment" : `Confirm Order ($${total.toFixed(2)})`}
            </button>
          </form>
        </div>

        {/* ORDER SUMMARY */}
        <div className={`p-4 sm:p-6 rounded-2xl shadow-md h-full border w-full max-w-full min-w-0 box-border ${isDark ? "bg-[#1e1e1e] border-gray-800" : "bg-white border-gray-200"}`}>
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-4 border-b border-gray-700 pb-4 mb-4 max-h-80 overflow-y-auto w-full">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center gap-2 w-full">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center flex-shrink-0">
                    <img src={item.thumbnail || item.image} alt="" className="max-h-full max-w-full object-contain rounded" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate pr-2">{item.title}</p>
                    <p className="text-xs opacity-60">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="text-sm font-bold flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center text-xl font-black w-full">
            <span>Total:</span>
            <span className="text-[#00bcd4]">${total.toFixed(2)}</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Checkout;