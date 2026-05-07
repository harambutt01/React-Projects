import { useCart } from "./CartContext";
import { useTheme } from "./ThemeContext";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="text-center mt-24">
        <p className={`text-lg ${isDark ? "text-white" : "text-black"}`}>
          Your cart is empty 🛒
        </p>
        <button
          onClick={() => navigate("/products")}
          className="mt-4 px-5 py-2 bg-black text-white rounded cursor-pointer hover:bg-[#333] transition-colors duration-200">
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className={`max-w-[700px] mx-auto mt-24 p-6 rounded-xl
      ${isDark ? "bg-[#1e1e1e] text-white" : "bg-white text-black"}`}>

      <h1 className="text-2xl font-bold mb-6">Your Cart 🛒</h1>

      {cartItems.map((item) => (
        <div key={item.id} className={`flex items-center gap-4 mb-4 p-4 rounded-xl border
          ${isDark ? "border-[#333]" : "border-[#e0e0e0]"}`}>

          <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />

          <div className="flex-1">
            <h3 className="font-semibold text-[0.95rem]">{item.name}</h3>
            <p className="text-[#4f6ef7] font-bold">${item.price.toFixed(2)}</p>

            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className={`w-7 h-7 rounded border cursor-pointer font-bold
                  ${isDark ? "border-[#555] bg-[#2a2a2a] text-white" : "border-[#ddd] bg-[#f5f5f5] text-black"}`}>
                -
              </button>
              <span className="font-semibold">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className={`w-7 h-7 rounded border cursor-pointer font-bold
                  ${isDark ? "border-[#555] bg-[#2a2a2a] text-white" : "border-[#ddd] bg-[#f5f5f5] text-black"}`}>
                +
              </button>
            </div>
          </div>

          <div className="text-right">
            <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-500 text-sm cursor-pointer bg-transparent border-none mt-2 hover:underline">
              Remove
            </button>
          </div>

        </div>
      ))}

      {/* Total */}
      <div className={`border-t pt-4 mt-4 ${isDark ? "border-[#333]" : "border-[#e0e0e0]"}`}>
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-xl font-bold text-[#4f6ef7]">${totalPrice.toFixed(2)}</span>
        </div>
        <button className="w-full py-3 bg-black text-white rounded font-semibold cursor-pointer hover:bg-[#333] transition-colors duration-200">
          Checkout
        </button>
      </div>

    </div>
  );
}

export default Cart;