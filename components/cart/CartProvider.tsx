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

const CART_STORAGE_KEY = "ankarom-cart";

const CartContext = createContext<CartContextValue | undefined>(undefined);

const toNumberPrice = (price: string) => {
  const cleaned = price.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
  const value = Number(cleaned);
  return Number.isNaN(value) ? 0 : value;
};

const toCartItem = (item: Partial<CartItem> & { id?: string; productId?: string; quantity?: number }): CartItem => ({
  id: item.id || item.productId || "",
  name: item.name || "Ürün",
  image: item.image || "/products/fleet-management-v2.jpg",
  rating: Number(item.rating || 0),
  reviewCount: Number(item.reviewCount || 0),
  currentPrice: item.currentPrice || "₺0",
  oldPrice: item.oldPrice || "₺0",
  discountPercent: Number(item.discountPercent || 0),
  deliveryText: item.deliveryText === "Ücretsiz Teslimat" ? "Ücretsiz Teslimat" : "Stokta Var",
  features: Array.isArray(item.features) ? item.features : [],
  detailDescription: item.detailDescription || "",
  quantity: Math.max(1, Number(item.quantity || 1)),
});



const getCartFromStorage = () => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return [] as CartItem[];
    }

    const parsed = JSON.parse(raw) as Array<Partial<CartItem>>;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((item) => (item.id || "").length > 0)
      .map((item) => toCartItem(item));
  } catch {
    return [];
  }
};



const mergeCartItems = (first: CartItem[], second: CartItem[]) => {
  const mergedMap = new Map<string, CartItem>();

  [...first, ...second].forEach((item) => {
    if (!item?.id) {
      return;
    }

    const existing = mergedMap.get(item.id);
    if (existing) {
      mergedMap.set(item.id, {
        ...existing,
        ...item,
        quantity: existing.quantity + item.quantity,
      });
      return;
    }

    mergedMap.set(item.id, toCartItem(item));
  });

  return Array.from(mergedMap.values());
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setItems(getCartFromStorage());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
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
