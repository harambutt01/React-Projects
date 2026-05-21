import { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from '../Config/Api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  // 1. Database se Cart fetch karne ka function
  const fetchCartItems = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) return;

    try {
      const response = await fetch(`${API_BASE_URL}/cart/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setCartItems(data);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const addToCart = async (product, quantity) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) return;

    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
          category: product.category || 'General'
        }),
      });

      if (!response.ok) throw new Error("Failed to add to cart");
      fetchCartItems(); // DB se data refresh karein
    } catch (error) {
      console.error("Cart Action Failed:", error);
    }
  };

  const removeFromCart = async (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    try {
      await fetch(`${API_BASE_URL}/cart/${id}`, { method: "DELETE" });
      fetchCartItems();
    } catch (error) {
      console.error("Delete Failed:", error);
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
    // Note: Yahan aap backend update bhi call kar sakti hain
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
    
    try {
      await fetch(`${API_BASE_URL}/cart/delete-multiple`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedItems }),
      });
      setSelectedItems([]);
      fetchCartItems(); // DB se sync karein
    } catch (error) {
      console.error("Bulk Delete Failed:", error);
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
        fetchCartItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}