import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTheme } from "./ThemeContext";

function Checkout() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  // 1. Shipping Details ka State (Aapke Backend ki requirement ke mutabiq)
  const [shipping, setShipping] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Pakistan",
  });

  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  // LocalStorage se Cart ka data load karna
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (savedCart.length === 0) {
      toast.error("Aapka cart khali hai!");
      navigate("/");
      return;
    }
    setCartItems(savedCart);
    
    // Total calculate karna (Summary ke liye)
    const sum = savedCart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setTotal(sum);
  }, [navigate]);

  const handleInput = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  // 2. Order Submit Function (Backend API Call)
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Backend expects: { cartItems, shipping, paymentMethod }
    const orderPayload = {
      cartItems: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity
      })),
      shipping: shipping,
      paymentMethod: paymentMethod
    };

    console.log("Sending Order Payload:", orderPayload);

    try {
      // Is URL ko apne backend port ke mutabiq check kar lena (e.g., 4000)
      const response = await fetch("http://localhost:4000/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(`🎉 Order Placed! ID: ${result.orderId}`);
        localStorage.removeItem("cart"); // Order ke baad cart clear
        window.dispatchEvent(new Event("cartUpdate")); // UI refresh
        navigate("/"); 
      } else {
        toast.error(result.error || "Order fail ho gaya");
      }
    } catch (err) {
      console.error("Checkout Error:", err);
      toast.error("Server connection error!");
    }
  };

  return (
    <div className={`min-h-screen p-4 md:p-10 ${isDark ? "bg-[#121212] text-white" : "bg-gray-100 text-black"}`}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* FORM SECTION: Shipping & Details */}
        <div className={`lg:col-span-2 p-6 rounded-2xl shadow-md ${isDark ? "bg-[#1e1e1e] border border-gray-800" : "bg-white"}`}>
          <h2 className="text-2xl font-bold mb-6 border-b pb-2">Shipping Information</h2>
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="name" placeholder="Full Name" required onChange={handleInput} className="p-3 rounded-lg border bg-transparent w-full" />
              <input type="email" name="email" placeholder="Email (Optional)" onChange={handleInput} className="p-3 rounded-lg border bg-transparent w-full" />
            </div>
            <input type="text" name="address" placeholder="Complete Street Address" required onChange={handleInput} className="p-3 rounded-lg border bg-transparent w-full" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <input type="text" name="city" placeholder="City" required onChange={handleInput} className="p-3 rounded-lg border bg-transparent w-full" />
              <input type="text" name="postalCode" placeholder="Postal Code" required onChange={handleInput} className="p-3 rounded-lg border bg-transparent w-full" />
              <input type="text" name="country" value={shipping.country} readOnly className="p-3 rounded-lg border bg-gray-500/20 w-full" />
            </div>
            
            <h2 className="text-xl font-bold mt-6 mb-4">Payment Method</h2>
            <select 
              value={paymentMethod} 
              onChange={(e) => setPaymentMethod(e.target.value)} 
              className="p-3 rounded-lg border bg-transparent w-full cursor-pointer focus:ring-2 focus:ring-[#00bcd4]"
            >
              <option value="Cash on Delivery">Cash on Delivery</option>
              <option value="Online Payment">Online Payment</option>
            </select>

            <button 
              type="submit" 
              className="w-full py-4 mt-6 bg-[#00bcd4] text-black font-black rounded-xl hover:opacity-80 transition-all uppercase tracking-widest shadow-lg"
            >
              Confirm Order (${total.toFixed(2)})
            </button>
          </form>
        </div>

        {/* ORDER SUMMARY SECTION */}
        <div className={`p-6 rounded-2xl shadow-md h-fit border ${isDark ? "bg-[#1e1e1e] border-gray-800" : "bg-white border-gray-200"}`}>
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-4 border-b border-gray-700 pb-4 mb-4 max-h-80 overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center">
                    <img src={item.image} alt="" className="max-h-full max-w-full object-contain" />
                  </div>
                  <div>
                    <p className="text-sm font-bold truncate w-24 md:w-32">{item.title}</p>
                    <p className="text-xs opacity-60">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center text-xl font-black">
            <span>Total:</span>
            <span className="text-[#00bcd4]">${total.toFixed(2)}</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Checkout;