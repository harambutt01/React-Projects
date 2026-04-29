import { useCart } from "./CartContext";
import { useTheme } from "./ThemeContext";

function CartDrawer({ isOpen, onClose }) {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();
  const { isDark } = useTheme();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[1]"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-screen w-[380px] z-[2001] flex flex-col transition-transform duration-300
        ${isDark ? "bg-[#1a1a1a] text-white" : "bg-white text-black"}
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}>

        {/* Header */}
        <div className={`flex justify-between items-center px-[20px] py-[20px] border-b
          ${isDark ? "border-[#333]" : "border-[#e0e0e0]"}`}>
          <h2 className="text-lg font-bold tracking-widest uppercase">Cart</h2>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-xl cursor-pointer"
            style={{ color: isDark ? "white" : "black" }}>
            ✕
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-[20px] py-[20px]">
          {cartItems.length === 0 ? (
            <p className={`text-center mt-[40px] ${isDark ? "text-[#aaa]" : "text-[#666]"}`}>
              Your cart is empty 🛒
            </p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className={`flex gap-[16px] mb-[20px] pb-[20px] border-b
                ${isDark ? "border-[#333]" : "border-[#e0e0e0]"}`}>

                {/* Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-[80px] h-[80px] object-cover rounded-lg"
                />

                {/* Info */}
                <div className="flex-1">
                  <h3 className="text-[14px] font-semibold mb-1">{item.name}</h3>
                  <p className="text-[13px] text-[#4f6ef7] font-bold mb-[8px]">
                    ${item.price.toFixed(2)}
                  </p>

                  {/* Quantity + Remove */}
                  <div className="flex items-center gap-[12px]">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className={`w-[28px] h-[28px] rounded border cursor-pointer font-bold text-sm
                        ${isDark ? "border-[#555] bg-[#2a2a2a] text-white" : "border-[#ddd] bg-[#f5f5f5] text-black"}`}>
                      -
                    </button>
                    <span className="font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className={`w-[28px] h-[28px] rounded border cursor-pointer font-bold text-sm
                        ${isDark ? "border-[#555] bg-[#2a2a2a] text-white" : "border-[#ddd] bg-[#f5f5f5] text-black"}`}>
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 text-sm cursor-pointer bg-transparent border-none ml-2 hover:underline">
                      Remove
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <p className="font-bold text-[14px]">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>

              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className={`px-[20px] py-[20px] border-t ${isDark ? "border-[#333]" : "border-[#e0e0e0]"}`}>
            <div className="flex justify-between items-center mb-[16px]">
              <span className="font-semibold">Total:</span>
              <span className="text-xl font-bold text-[#4f6ef7]">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <button className="w-full py-[12px] bg-black text-white font-semibold rounded cursor-pointer hover:bg-[#333] transition-colors duration-200">
              CHECKOUT • ${totalPrice.toFixed(2)}
            </button>
          </div>
        )}

      </div>
    </>
  );
}

export default CartDrawer;