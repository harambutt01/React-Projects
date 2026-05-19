import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
    setSelectedItems((prev) => prev.filter((id) => cartItems.some((item) => item.id === id)));
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

    try {
      const response = await fetch("http://localhost:4000/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }
    } catch (error) {
      console.error("Cart Action Failed:", error);
    }
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const toggleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemIds) => itemIds !== id));
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

    setCartItems((prev) => prev.filter((item) => !selectedItems.includes(item.id)));

    try {
      const response = await fetch("http://localhost:4000/api/cart/delete-multiple", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedItems }), 
      });

      if (!response.ok) {
        throw new Error("Failed to delete selected items from cart");
      }

      setSelectedItems([]);
    } catch (error) {
      console.error("Cart Action Failed:", error);
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}