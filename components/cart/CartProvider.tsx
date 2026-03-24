"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { TrailerProduct } from "@/lib/trailerProducts";
import { useAuth } from "@/components/auth/AuthProvider";

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

const GUEST_STORAGE_KEY = "ankarom-cart-guest";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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

const getGuestCartFromStorage = () => {
  try {
    const raw = localStorage.getItem(GUEST_STORAGE_KEY);
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

const syncCartToBackend = async (token: string, items: CartItem[]) => {
  await fetch(`${API_BASE_URL}/api/cart/sync`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        currentPrice: item.currentPrice,
        image: item.image,
        deliveryText: item.deliveryText,
        quantity: item.quantity,
      })),
    }),
  });
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const { isAuthenticated, token } = useAuth();
  const previousAuthStateRef = useRef(isAuthenticated);
  const hasLoadedAuthenticatedCartRef = useRef(false);

  useEffect(() => {
    setItems(getGuestCartFromStorage());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!isAuthenticated) {
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isHydrated, isAuthenticated]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const loadAuthenticatedCart = async () => {
      if (!isAuthenticated || !token) {
        hasLoadedAuthenticatedCartRef.current = false;
        return;
      }

      try {
        const guestItems = getGuestCartFromStorage();

        const response = await fetch(`${API_BASE_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = (await response.json()) as {
          items?: Array<Partial<CartItem> & { productId?: string; quantity?: number }>;
          message?: string;
        };

        if (!response.ok) {
          throw new Error(data.message || "Sepet bilgisi getirilemedi.");
        }

        const dbItems = Array.isArray(data.items)
          ? data.items.map((item) => toCartItem(item)).filter((item) => item.id)
          : [];

        const mergedItems = mergeCartItems(dbItems, guestItems);
        setItems(mergedItems);
        await syncCartToBackend(token, mergedItems);
        localStorage.removeItem(GUEST_STORAGE_KEY);
        hasLoadedAuthenticatedCartRef.current = true;
      } catch {
        hasLoadedAuthenticatedCartRef.current = false;
      }
    };

    loadAuthenticatedCart();

    if (previousAuthStateRef.current && !isAuthenticated) {
      setItems([]);
      hasLoadedAuthenticatedCartRef.current = false;
    }

    previousAuthStateRef.current = isAuthenticated;
  }, [isAuthenticated, isHydrated, token]);

  useEffect(() => {
    if (!isHydrated || !isAuthenticated || !token || !hasLoadedAuthenticatedCartRef.current) {
      return;
    }

    syncCartToBackend(token, items).catch(() => {
      // Hata durumunda UI'ı bozmayız, kullanıcı tekrar işlem yaptığında yeniden denenecek.
    });
  }, [items, isAuthenticated, token, isHydrated]);

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
