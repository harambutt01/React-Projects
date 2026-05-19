import { useCart } from "./CartContext";
import { useTheme } from "./ThemeContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; 
import Swal from "sweetalert2"; 

function CartDrawer({ isOpen, onClose }) {
  const { 
    cartItems, 
    selectedItems, 
    removeFromCart, 
    updateQuantity, 
    toggleSelectItem,
    toggleSelectAll,
    deleteSelectedFromCart
  } = useCart();
  
  const { isDark } = useTheme();
  const navigate = useNavigate(); 

  const handleQuantityDecrease = (id, currentQty) => {
    updateQuantity(id, currentQty - 1);
  };

  const handleQuantityIncrease = (id, currentQty) => {
    updateQuantity(id, currentQty + 1);
  };

  const handleRemoveItem = (id, title) => {
    removeFromCart(id);
    toast.error(`${title} removed from cart`, {
      position: "top-right",
      autoClose: 2000,
      theme: "colored",
      style: { zIndex: 99999 }
    });
  };

  const handleDeleteSelectedClick = () => {
    Swal.fire({
      title: 'Remove from cart?',
      text: `Are you sure you want to delete these ${selectedItems.length} item(s)?`,
      icon: 'warning',
      width: '300px', 
      showCancelButton: true,
      confirmButtonColor: '#00bcd4', 
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove!',
      cancelButtonText: 'Cancel',
      background: isDark ? '#242424' : '#fff', 
      color: isDark ? '#fff' : '#000',          
      
      customClass: {
        popup: 'rounded-lg p-3 pb-4 flex flex-col items-center justify-center m-0', 
        title: 'text-sm font-bold p-0 m-0 mt-1 text-center w-full leading-tight', 
        htmlContainer: 'text-[11px] p-0 my-1 mt-2 text-gray-400 text-center w-full leading-normal', 
        actions: 'p-0 m-0 mt-3 gap-2 w-full justify-center flex flex-row items-center', 
        confirmButton: 'text-[11px] py-1.5 px-3.5 m-0 rounded-md font-bold', 
        cancelButton: 'text-[11px] py-1.5 px-3.5 m-0 rounded-md font-bold'
      },
      
      didOpen: () => {
        const container = Swal.getContainer();
        if (container) {
          container.style.zIndex = '99999'; 
        }
        
        const icon = Swal.getIcon();
        if (icon) {
          icon.style.transform = 'scale(0.6)'; 
          icon.style.margin = '5px auto 0px auto'; 
        }
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteSelectedFromCart();
        toast.error("Selected items removed", {
          position: "top-right",
          autoClose: 2000,
          theme: "colored"
        });
      }
    });
  };

  const dynamicTotalPrice = cartItems
    .filter(item => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    const itemsToCheckout = cartItems.filter(item => selectedItems.includes(item.id));

    if (itemsToCheckout.length === 0) {
      toast.warning("Please select at least one item to checkout", {
        position: "top-right",
        autoClose: 2000,
        theme: isDark ? "dark" : "light",
        style: { zIndex: 99999 }
      });
      return;
    }

    localStorage.setItem("checkout_staging", JSON.stringify(itemsToCheckout));

    onClose(); 
    navigate("/checkout"); 
  };

  const borderColor = isDark ? "border-[#333]" : "border-[#e0e0e0]";
  const qtyBtn = isDark ? "bg-[#2a2a2a] text-white" : "bg-[#f5f5f5] text-black";
  const isAllSelected = cartItems.length > 0 && selectedItems.length === cartItems.length;

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
      <div className={`fixed top-0 right-0 h-screen w-[85%] sm:w-[400px] z-[2002] flex flex-col transition-transform duration-300 ease-in-out shadow-2xl
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

        {/* Select All Sub-Header */}
        {cartItems.length > 0 && (
          <div className={`flex justify-between items-center px-5 py-3 border-b bg-opacity-10 ${borderColor} ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold uppercase tracking-wider">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={toggleSelectAll}
                className="w-4 h-4 accent-[#00bcd4] cursor-pointer"
              />
              Select All ({cartItems.length})
            </label>
            
            {selectedItems.length > 0 && (
              <button
                onClick={handleDeleteSelectedClick}
                className="text-xs font-bold text-red-500 hover:underline bg-transparent border-none cursor-pointer"
              >
                DELETE ({selectedItems.length})
              </button>
            )}
          </div>
        )}

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
              <div key={item.id} className={`flex items-center gap-2 sm:gap-3 mb-5 pb-5 border-b ${borderColor} ${!selectedItems.includes(item.id) ? 'opacity-50' : ''}`}>
                
                {/* Individual Checkbox */}
                <div className="flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleSelectItem(item.id)}
                    className="w-4 h-4 accent-[#00bcd4] cursor-pointer"
                  />
                </div>

                {/* Image */}
                <div className="w-[65px] h-[65px] sm:w-[75px] sm:h-[75px] flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src={item.thumbnail || item.image}
                    alt={item.title}
                    className="w-full h-full object-contain p-1"
                    onError={(e) => { e.target.src = "https://placehold.co/150?text=No+Image"; }}
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
                      onClick={() => handleRemoveItem(item.id, item.title || item.name)}
                      className="text-red-500 text-[11px] sm:text-xs cursor-pointer bg-transparent border-none hover:underline font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <p className="font-bold text-[13px] sm:text-[14px] flex-shrink-0 pl-1">
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
              <span className="font-semibold text-gray-500">Subtotal Selected:</span>
              <span className="text-xl font-bold text-[#00bcd4]">${dynamicTotalPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout} 
              className="w-full py-[14px] bg-black text-white font-bold rounded-xl cursor-pointer hover:bg-gray-800 transition-all shadow-md active:scale-[0.98]"
            >
              CHECKOUT SELECTED ({selectedItems.length})
            </button>
          </div>
        )}

      </div>
    </>
  );
}

export default CartDrawer;