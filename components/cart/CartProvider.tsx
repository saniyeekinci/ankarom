"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { TrailerProduct } from "@/lib/trailerProducts";

export type CartItem = TrailerProduct & {
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addToCart: (product: TrailerProduct) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "ankarom-cart";

const CartContext = createContext<CartContextValue | undefined>(undefined);

const toNumberPrice = (price: string) => {
  const cleaned = price.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
  const value = Number(cleaned);
  return Number.isNaN(value) ? 0 : value;
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        setItems(Array.isArray(parsed) ? parsed : []);
      }
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isHydrated]);

  const addToCart = (product: TrailerProduct) => {
    setItems((previous) => {
      const existingItem = previous.find((item) => item.id === product.id);
      if (existingItem) {
        return previous.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...previous, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((previous) => previous.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((previous) =>
      previous.map((item) => (item.id === productId ? { ...item, quantity } : item)),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + toNumberPrice(item.currentPrice) * item.quantity, 0),
    [items],
  );

  const contextValue = { items, itemCount, subtotal, addToCart, removeFromCart, updateQuantity, clearCart };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
