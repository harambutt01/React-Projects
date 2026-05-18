import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTheme } from "./ThemeContext";

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

  useEffect(() => {
    // 1. Pehle temporary staging cache read karein
    const stagedItems = JSON.parse(localStorage.getItem("checkout_staging"));
    
    if (stagedItems && stagedItems.length > 0) {
      setCartItems(stagedItems);
      const sum = stagedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      setTotal(sum);
    } else {
      // Fallback agar user direct URL access kar le aur staging khali ho
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      if (savedCart.length === 0) {
        navigate("/");
        return;
      }
      setCartItems(savedCart);
      const sum = savedCart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      setTotal(sum);
    }
  }, [navigate]);

  const handleInput = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    const currentUserId = 2; 

    // Payload structure ready kiya
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
      total: total // Total payment page ke liye send kar rahe hain
    };

    // 🟢 DUMMY PAYMENT ROUTING (SENIOR'S REQUIREMENT)
    if (paymentMethod === "Online Payment") {
      // Agar online payment hai toh payload router state mein daal kar redirect kar do
      navigate("/payment", { state: { orderPayload } });
      return; 
    }

    // 🟢 CASH ON DELIVERY ROUTE (Purana database saving code)
    try {
      const response = await fetch("http://localhost:4000/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(`🎉 Order Placed! ID: ${result.orderId}`);

        // LOCAL STORAGE STORAGE MATCH & FILTER CLEANING
        const orderedProductIds = cartItems.map(item => item.id || item.product_id);
        const fullCart = JSON.parse(localStorage.getItem("cart")) || [];
        const remainingCartItems = fullCart.filter(item => !orderedProductIds.includes(item.id));
        
        // Cache updates
        localStorage.setItem("cart", JSON.stringify(remainingCartItems));
        localStorage.removeItem("checkout_staging"); 
        
        window.dispatchEvent(new Event("cartUpdate")); 
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
        
        {/* FORM SECTION */}
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
              {paymentMethod === "Online Payment" ? "Proceed to Payment" : `Confirm Order ($${total.toFixed(2)})`}
            </button>
          </form>
        </div>

        {/* ORDER SUMMARY */}
        <div className={`p-6 rounded-2xl shadow-md h-fit border ${isDark ? "bg-[#1e1e1e] border-gray-800" : "bg-white border-gray-200"}`}>
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-4 border-b border-gray-700 pb-4 mb-4 max-h-80 overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center">
                    <img src={item.thumbnail || item.image} alt="" className="max-h-full max-w-full object-contain rounded" />
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