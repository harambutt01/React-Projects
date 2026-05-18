import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTheme } from "./ThemeContext"; 

function Payment() {
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  
  const orderPayload = location.state?.orderPayload;

  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState({
    cardNumber: "4242 4242 4242 4242", 
    expiry: "12/28",
    cvv: "123",
    holderName: orderPayload?.shipping?.name || ""
  });

  if (!orderPayload) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold">
        No payment details found. Going back...
        {setTimeout(() => navigate("/"), 2000)}
      </div>
    );
  }

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(async () => {
      try {
        const response = await fetch("http://localhost:4000/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...orderPayload,
            paymentStatus: "Paid", 
            transactionId: "TXN_MOCK_" + Math.floor(Math.random() * 1000000)
          }),
        });

        const result = await response.json();

        if (response.ok) {
          toast.success(`💳 Payment Successful & Order Placed! ID: ${result.orderId}`);
          
          // Local storage cache cleanups
          const orderedProductIds = orderPayload.cartItems.map(item => item.product_id);
          const fullCart = JSON.parse(localStorage.getItem("cart")) || [];
          const remainingCartItems = fullCart.filter(item => !orderedProductIds.includes(item.id));
          
          localStorage.setItem("cart", JSON.stringify(remainingCartItems));
          localStorage.removeItem("checkout_staging");
          
          window.dispatchEvent(new Event("cartUpdate"));
          navigate("/");
        } else {
          toast.error(result.error || "Order generation failed after payment");
        }
      } catch (err) {
        console.error("Payment Error:", err);
        toast.error("Server connection error during payment validation!");
      } finally {
        setLoading(false);
      }
    }, 2000); 
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? "bg-[#121212] text-white" : "bg-gray-100 text-black"}`}>
      <div className={`max-w-md w-full p-6 rounded-2xl shadow-xl border ${isDark ? "bg-[#1e1e1e] border-gray-800" : "bg-white border-gray-200"}`}>
        
        <h2 className="text-xl font-black mb-2 uppercase tracking-wide">Secure Checkout</h2>
        <p className="text-xs opacity-60 mb-6">Amount to Pay: <span className="text-[#00bcd4] font-bold">${orderPayload.total.toFixed(2)}</span></p>

        {/* Dummy Visual Credit Card */}
        <div className="w-full h-44 bg-gradient-to-br from-[#00bcd4] to-[#1a237e] rounded-xl p-4 text-white flex flex-col justify-between shadow-lg mb-6">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold tracking-widest">DUMMY CARD</span>
            <span className="italic text-sm font-black">VISA</span>
          </div>
          <p className="text-lg tracking-widest font-mono my-2">{cardData.cardNumber}</p>
          <div className="flex justify-between text-[10px]">
            <div>
              <p className="opacity-60 text-[8px]">CARD HOLDER</p>
              <p className="uppercase font-bold truncate w-36">{cardData.holderName || "Your Name"}</p>
            </div>
            <div>
              <p className="opacity-60 text-[8px]">EXPIRES</p>
              <p className="font-bold">{cardData.expiry}</p>
            </div>
          </div>
        </div>

        {/* Interactive Input Form */}
        <form onSubmit={handlePay} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs opacity-70 mb-1">Card Holder Name</label>
            <input type="text" value={cardData.holderName} required
              onChange={(e) => setCardData({...cardData, holderName: e.target.value})}
              className="w-full p-3 rounded-lg border bg-transparent" />
          </div>

          <div>
            <label className="block text-xs opacity-70 mb-1">Card Number</label>
            <input type="text" value={cardData.cardNumber} required maxLength="19"
              onChange={(e) => setCardData({...cardData, cardNumber: e.target.value})}
              className="w-full p-3 rounded-lg border bg-transparent font-mono" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs opacity-70 mb-1">Expiration (MM/YY)</label>
              <input type="text" value={cardData.expiry} required maxLength="5" placeholder="MM/YY"
                onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                className="w-full p-3 rounded-lg border bg-transparent text-center" />
            </div>
            <div>
              <label className="block text-xs opacity-70 mb-1">CVV / CVC</label>
              <input type="password" value={cardData.cvv} required maxLength="3" placeholder="***"
                onChange={(e) => setCardData({...cardData, cvv: e.target.value})}
                className="w-full p-3 rounded-lg border bg-transparent text-center font-mono" />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-4 mt-4 bg-[#00bcd4] text-black font-black rounded-xl hover:opacity-90 transition-all uppercase tracking-widest shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                Processing Payment...
              </>
            ) : (
              `Authorize Mock Pay ($${orderPayload.total.toFixed(2)})`
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Payment;