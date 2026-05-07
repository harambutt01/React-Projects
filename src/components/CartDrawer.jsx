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
          className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[2001]"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-screen w-[85%] sm:w-[380px] z-[2002] flex flex-col transition-transform duration-300 ease-in-out shadow-2xl
        ${isDark ? "bg-[#1a1a1a] text-white" : "bg-white text-black"}
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}>

        {/* Header */}
        <div className={`flex justify-between items-center px-[20px] py-[20px] border-b
          ${isDark ? "border-[#333]" : "border-[#e0e0e0]"}`}>
          <h2 className="text-lg font-bold tracking-widest uppercase">Cart</h2>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-2xl cursor-pointer hover:rotate-90 transition-transform duration-200"
            style={{ color: isDark ? "white" : "black" }}>
            ✕
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-[15px] sm:px-[20px] py-[20px]">
          {cartItems.length === 0 ? (
            <div className="text-center mt-[60px]">
              <p className="text-4xl mb-4">🛒</p>
              <p className={`${isDark ? "text-[#aaa]" : "text-[#666]"} font-medium`}>
                Your cart is empty
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className={`flex gap-[12px] sm:gap-[16px] mb-[20px] pb-[20px] border-b
                ${isDark ? "border-[#333]" : "border-[#e0e0e0]"}`}>

                {/* IMAGE FIX: flex-shrink-0 added and src changed to thumbnail */}
                <div className="w-[70px] h-[70px] sm:w-[80px] sm:h-[80px] flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src={item.thumbnail || item.image} 
                    alt={item.title}
                    className="w-full h-full object-contain p-1"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=No+Image" }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  {/* TITLE FIX: item.name changed to item.title */}
                  <h3 className="text-[13px] sm:text-[14px] font-semibold mb-1 line-clamp-1">
                    {item.title || item.name}
                  </h3>
                  <p className="text-[13px] text-[#00bcd4] font-bold mb-[8px]">
                    ${item.price.toFixed(2)}
                  </p>

                  {/* Quantity + Remove */}
                  <div className="flex items-center gap-[10px] sm:gap-[12px]">
                    <div className="flex items-center border rounded-md overflow-hidden">
                       <button
                         onClick={() => updateQuantity(item.id, item.quantity - 1)}
                         className={`px-2 py-1 cursor-pointer border-none text-xs font-bold
                           ${isDark ? "bg-[#2a2a2a] text-white" : "bg-[#f5f5f5] text-black"}`}>
                         -
                       </button>
                       <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                       <button
                         onClick={() => updateQuantity(item.id, item.quantity + 1)}
                         className={`px-2 py-1 cursor-pointer border-none text-xs font-bold
                           ${isDark ? "bg-[#2a2a2a] text-white" : "bg-[#f5f5f5] text-black"}`}>
                         +
                       </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 text-[11px] sm:text-xs cursor-pointer bg-transparent border-none hover:underline font-medium">
                      Remove
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <p className="font-bold text-[13px] sm:text-[14px] flex-shrink-0">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>

              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className={`px-[20px] py-[25px] border-t shadow-[0_-4px_10px_rgba(0,0,0,0.05)]
            ${isDark ? "border-[#333] bg-[#1a1a1a]" : "border-[#e0e0e0] bg-white"}`}>
            <div className="flex justify-between items-center mb-[20px]">
              <span className="font-semibold text-gray-500">Subtotal:</span>
              <span className="text-xl font-bold text-[#00bcd4]">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <button className="w-full py-[14px] bg-black text-white font-bold rounded-xl cursor-pointer hover:bg-gray-800 transition-all shadow-md active:scale-[0.98]">
              CHECKOUT
            </button>
          </div>
        )}

      </div>
    </>
  );
}

export default CartDrawer;