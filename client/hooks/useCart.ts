import { useState, useCallback, useEffect } from "react";
import { CartItem } from "@shared/api";

const CART_CACHE_KEY = "shopping_cart";

interface UseCartState {
  items: CartItem[];
  subtotal: number;
  estimatedTax: number;
  total: number;
  itemCount: number;
}

const TAX_RATE = 0.08; // 8% default tax rate, should come from Square

export function useCart() {
  const [state, setState] = useState<UseCartState>({
    items: [],
    subtotal: 0,
    estimatedTax: 0,
    total: 0,
    itemCount: 0,
  });

  // Load cart from storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(CART_CACHE_KEY);
    if (saved) {
      try {
        const items = JSON.parse(saved) as CartItem[];
        updateCartTotals(items);
      } catch (error) {
        console.error("Failed to load cart:", error);
      }
    }
  }, []);

  const updateCartTotals = (items: CartItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const estimatedTax = subtotal * TAX_RATE;
    const total = subtotal + estimatedTax;
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    setState({
      items,
      subtotal: Math.round(subtotal * 100) / 100,
      estimatedTax: Math.round(estimatedTax * 100) / 100,
      total: Math.round(total * 100) / 100,
      itemCount,
    });

    // Persist to storage
    try {
      localStorage.setItem(CART_CACHE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  };

  const addToCart = useCallback(
    (item: CartItem) => {
      setState((prev) => {
        const existing = prev.items.find(
          (i) =>
            i.productId === item.productId &&
            JSON.stringify(i.modifiers) === JSON.stringify(item.modifiers)
        );

        let newItems: CartItem[];
        if (existing) {
          newItems = prev.items.map((i) =>
            i === existing ? { ...i, quantity: i.quantity + item.quantity } : i
          );
        } else {
          newItems = [...prev.items, item];
        }

        updateCartTotals(newItems);
        return state;
      });
    },
    []
  );

  const removeFromCart = useCallback((productId: string, modifiers?: Record<string, string>) => {
    setState((prev) => {
      const filtered = prev.items.filter((item) => {
        if (item.productId !== productId) return true;
        if (!modifiers) return false;
        return JSON.stringify(item.modifiers) !== JSON.stringify(modifiers);
      });

      updateCartTotals(filtered);
      return state;
    });
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number, modifiers?: Record<string, string>) => {
      if (quantity <= 0) {
        removeFromCart(productId, modifiers);
        return;
      }

      setState((prev) => {
        const newItems = prev.items.map((item) => {
          if (
            item.productId === productId &&
            (!modifiers || JSON.stringify(item.modifiers) === JSON.stringify(modifiers))
          ) {
            return { ...item, quantity };
          }
          return item;
        });

        updateCartTotals(newItems);
        return state;
      });
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setState({
      items: [],
      subtotal: 0,
      estimatedTax: 0,
      total: 0,
      itemCount: 0,
    });

    try {
      localStorage.removeItem(CART_CACHE_KEY);
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  }, []);

  const getCartItem = useCallback(
    (productId: string, modifiers?: Record<string, string>) => {
      return state.items.find(
        (item) =>
          item.productId === productId &&
          (!modifiers || JSON.stringify(item.modifiers) === JSON.stringify(modifiers))
      );
    },
    [state.items]
  );

  return {
    items: state.items,
    subtotal: state.subtotal,
    estimatedTax: state.estimatedTax,
    total: state.total,
    itemCount: state.itemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItem,
  };
}
