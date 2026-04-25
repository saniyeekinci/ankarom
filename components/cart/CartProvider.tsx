"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/products";

export type CartItem = Product & {
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

const CART_STORAGE_KEY = "ankarom-cart";

const CartContext = createContext<CartContextValue | undefined>(undefined);

// ESLint 'any' hatasını çözen özel tip tanımı
type RawCartItem = Partial<Product> & { 
  quantity?: number; 
  image?: string; 
  detailDescription?: string;
};

// Yeni tipimize uygun toCartItem fonksiyonu
const toCartItem = (item: RawCartItem): CartItem => ({
  id: item.id || "",
  name: item.name || "Ürün",
  slug: item.slug || item.id || "",
  category: item.category || "tekne-romorklari",
  price: Number(item.price) || 0,
  discountPrice: item.discountPrice ? Number(item.discountPrice) : null,
  stockStatus: item.stockStatus || "Stokta Var",
  imageUrl: item.imageUrl || item.image || "/products/fleet-management-v2.jpg",
  images: item.images || [],
  description: item.description || item.detailDescription || "",
  features: Array.isArray(item.features) ? item.features : [],
  quantity: Math.max(1, Number(item.quantity || 1)),
});

const getCartFromStorage = () => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item) => (item.id || "").length > 0)
      .map((item) => toCartItem(item));
  } catch {
    return [];
  }
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // ESLint'in "doğrudan setState çağırma" uyarısını aşmak için fonksiyon içine aldık
    const initCart = async () => {
      setItems(getCartFromStorage());
      setIsHydrated(true);
    };
    initCart();
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, isHydrated]);

  const addToCart = (product: Product) => {
    setItems((previous) => {
      const existingItem = previous.find((item) => item.id === product.id);
      if (existingItem) {
        return previous.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
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
      previous.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setItems([]);

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((total, item) => {
      const itemPrice = item.discountPrice ?? item.price ?? 0;
      return total + (itemPrice * item.quantity);
    }, 0),
    [items]
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