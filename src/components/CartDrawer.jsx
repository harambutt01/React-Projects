import { useCart } from "./CartContext";
import { useTheme } from "./ThemeContext";
import { toast } from "react-toastify"; // 1. Toast import kiya

function CartDrawer({ isOpen, onClose }) {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();
  const { isDark } = useTheme();

  const handleQuantityDecrease = (id, currentQty) => {
    updateQuantity(id, currentQty - 1);
  };

  const handleQuantityIncrease = (id, currentQty) => {
    updateQuantity(id, currentQty + 1);
  };

  // 2. Updated function to accept title
  const handleRemoveItem = (id, title) => {
    removeFromCart(id);
    toast.error(`${title} removed from cart`, {
      position: "top-right",
      autoClose: 2000,
      theme: "colored",
      style: { zIndex: 99999 }
    });
  };

  const handleCheckout = () => {
    alert("Checkout coming soon!");
  };

  const borderColor = isDark ? "border-[#333]" : "border-[#e0e0e0]";
  const qtyBtn = isDark ? "bg-[#2a2a2a] text-white" : "bg-[#f5f5f5] text-black";

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
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >

        {/* Header */}
        <div className={`flex justify-between items-center px-5 py-5 border-b ${borderColor}`}>
          <h2 className="text-lg font-bold tracking-widest uppercase">Cart</h2>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-2xl cursor-pointer hover:rotate-90 transition-transform duration-200"
            style={{ color: isDark ? "white" : "black" }}
          >
            ✕
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-5">
          {cartItems.length === 0 ? (
            <div className="text-center mt-16">
              <p className="text-4xl mb-4">🛒</p>
              <p className={`font-medium ${isDark ? "text-[#aaa]" : "text-[#666]"}`}>
                Go Shopping
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className={`flex gap-3 sm:gap-4 mb-5 pb-5 border-b ${borderColor}`}>

                {/* Image */}
                <div className="w-[70px] h-[70px] sm:w-[80px] sm:h-[80px] flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src={item.thumbnail || item.image}
                    alt={item.title}
                    className="w-full h-full object-contain p-1"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=No+Image"; }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-[13px] sm:text-[14px] font-semibold mb-1 line-clamp-1">
                    {item.title || item.name}
                  </h3>
                  <p className="text-[13px] text-[#00bcd4] font-bold mb-2">
                    ${Number(item.price).toFixed(2)}
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border rounded-md overflow-hidden">
                      <button
                        onClick={() => handleQuantityDecrease(item.id, item.quantity)}
                        className={`px-2 py-1 cursor-pointer border-none text-xs font-bold ${qtyBtn}`}
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityIncrease(item.id, item.quantity)}
                        className={`px-2 py-1 cursor-pointer border-none text-xs font-bold ${qtyBtn}`}
                      >
                        +
                      </button>
                    </div>
                    <button
                      // 4. Item title yahan pass kiya
                      onClick={() => handleRemoveItem(item.id, item.title || item.name)}
                      className="text-red-500 text-[11px] sm:text-xs cursor-pointer bg-transparent border-none hover:underline font-medium"
                    >
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
          <div className={`px-5 py-6 border-t shadow-[0_-4px_10px_rgba(0,0,0,0.05)]
            ${isDark ? "border-[#333] bg-[#1a1a1a]" : "border-[#e0e0e0] bg-white"}`}
          >
            <div className="flex justify-between items-center mb-5">
              <span className="font-semibold text-gray-500">Subtotal:</span>
              <span className="text-xl font-bold text-[#00bcd4]">${totalPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full py-[14px] bg-black text-white font-bold rounded-xl cursor-pointer hover:bg-gray-800 transition-all shadow-md active:scale-[0.98]"
            >
              CHECKOUT
            </button>
          </div>
        )}

      </div>
    </>
  );
}

export default CartDrawer;