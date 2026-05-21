import { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from '../Config/Api';


const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const syncCart = () => {
      const saved = localStorage.getItem("cart");
      if (saved) {
        setCartItems(JSON.parse(saved));
      }
    };
    window.addEventListener("cartUpdate", syncCart);
    return () => window.removeEventListener("cartUpdate", syncCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
    setSelectedItems((prev) =>
      prev.filter((id) => cartItems.some((item) => item.id === id))
    );
  }, [cartItems]);

  const addToCart = async (product, quantity) => {
    const updatedCart = [...cartItems];
    const existing = updatedCart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      updatedCart.push({ ...product, quantity });
    }

    setCartItems(updatedCart);
    window.dispatchEvent(new Event("cartUpdate"));

    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?.id,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
        }),
      });

      if (!response.ok) throw new Error("Failed to add item to cart");
    } catch (error) {
      console.error("Cart Action Failed:", error);
    }
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    window.dispatchEvent(new Event("cartUpdate"));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
    window.dispatchEvent(new Event("cartUpdate"));
  };

  const toggleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.id));
    }
  };

  const deleteSelectedFromCart = async () => {
    if (selectedItems.length === 0) return;

    setCartItems((prev) =>
      prev.filter((item) => !selectedItems.includes(item.id))
    );
    window.dispatchEvent(new Event("cartUpdate"));

    try {
      const response = await fetch(
        `${API_BASE_URL}/cart/delete-multiple`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: selectedItems }),
        }
      );

      if (!response.ok) throw new Error("Failed to delete");
      setSelectedItems([]);
    } catch (error) {
      console.error("Cart Action Failed:", error);
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        selectedItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleSelectItem,
        toggleSelectAll,
        deleteSelectedFromCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}