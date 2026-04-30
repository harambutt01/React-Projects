import { useCart } from "./CartContext";
import { useTheme } from "./ThemeContext";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { cartItems, totalPrice, updateQuantity, removeFromCart } = useCart();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen pt-24 pb-12 px-6 transition-all duration-300 ${isDark ? "bg-[#121212] text-white" : "bg-[#f5f5f5] text-black"}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl mb-6">Your cart is empty 🛒</p>
            <button 
              onClick={() => navigate("/products")}
              className="bg-[#00bcd4] text-white px-6 py-3 rounded-lg font-bold">
              Shop Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {/* Items List */}
            <div className={`p-6 rounded-xl shadow-sm ${isDark ? "bg-[#1e1e1e]" : "bg-white"}`}>
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                  <div className="flex-1">
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-[#00bcd4] font-bold">${item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 border rounded">-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 border rounded">+</button>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm ml-4">Remove</button>
                    </div>
                  </div>
                  <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            {/* Total Summary */}
            <div className={`p-6 rounded-xl shadow-sm h-fit ${isDark ? "bg-[#1e1e1e]" : "bg-white"}`}>
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold">Order Total:</span>
                <span className="text-2xl font-bold text-[#00bcd4]">${totalPrice.toFixed(2)}</span>
              </div>
              <button className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;