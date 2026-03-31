"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { HeartIcon as HeartOutlineIcon, ShoppingBagIcon, TruckIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import type { TrailerProduct } from "@/lib/trailerProducts";
import { useCart } from "@/components/cart/CartProvider";

const FAVORITES_STORAGE_KEY = "ankarom-favorite-product-ids";
const localListeners = new Set<() => void>();
const EMPTY_FAVORITES: string[] = [];

let cachedSerializedFavorites = "[]";
let cachedFavoriteIds: string[] = EMPTY_FAVORITES;

const readFavoriteIds = () => {
  if (typeof window === "undefined") {
    return EMPTY_FAVORITES;
  }

  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY) ?? "[]";

    if (raw !== cachedSerializedFavorites) {
      const parsed = JSON.parse(raw) as string[];
      cachedFavoriteIds = Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : EMPTY_FAVORITES;
      cachedSerializedFavorites = raw;
    }

    return cachedFavoriteIds;
  } catch {
    cachedSerializedFavorites = "[]";
    cachedFavoriteIds = EMPTY_FAVORITES;
    return cachedFavoriteIds;
  }
};

const writeFavoriteIds = (ids: string[]) => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
  localListeners.forEach((listener) => listener());
};

const subscribeFavorites = (listener: () => void) => {
  localListeners.add(listener);

  if (typeof window === "undefined") {
    return () => {
      localListeners.delete(listener);
    };
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === FAVORITES_STORAGE_KEY) {
      listener();
    }
  };

  window.addEventListener("storage", onStorage);

  return () => {
    localListeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
};

type ProductsGridWithFavoritesProps = {
  products: TrailerProduct[];
};

export default function ProductsGridWithFavorites({ products }: ProductsGridWithFavoritesProps) {
  const favoriteIds = useSyncExternalStore(subscribeFavorites, readFavoriteIds, () => EMPTY_FAVORITES);
  const favoriteIdSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);
  const { addToCart } = useCart();
  const router = useRouter();

  const toggleFavorite = (productId: string) => {
    const next = favoriteIdSet.has(productId)
      ? favoriteIds.filter((id) => id !== productId)
      : [...favoriteIds, productId];

    writeFavoriteIds(next);
  };

  const handleQuickBuy = (product: TrailerProduct) => {
    addToCart(product);
    router.push("/sepetlerim");
  };

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => {
        const isFavorite = favoriteIdSet.has(product.id);

        return (
          <article
            key={product.id}
            className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200"
          >
            <button
              type="button"
              onClick={() => toggleFavorite(product.id)}
              aria-label={isFavorite ? "Favorilerden çıkar" : "Favoriye ekle"}
              className={`absolute right-5 top-5 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border text-slate-200 transition-colors ${
                isFavorite
                  ? "border-rose-200 bg-rose-50 text-rose-500"
                  : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              {isFavorite ? <HeartSolidIcon className="h-4 w-4" /> : <HeartOutlineIcon className="h-4 w-4" />}
            </button>

            <Link href={`/urunler/${product.id}`} className="block overflow-hidden rounded-2xl border border-slate-200">
              <div className="relative aspect-4/3 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-900/35 to-transparent" />
              </div>
            </Link>

            <div className="px-1 pb-2 pt-4">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <TruckIcon className="h-4 w-4" />
                <span>{product.deliveryText}</span>
              </div>

              <Link href={`/urunler/${product.id}`} className="block">
                <h2 className="line-clamp-2 text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-blue-700">
                  {product.name}
                </h2>
              </Link>

              <div className="mt-4 flex items-end justify-between gap-3">
                <div>
                  <p className="text-xl font-extrabold text-slate-900">{product.currentPrice}</p>
                  <p className="mt-1 text-xs text-slate-500 line-through">{product.oldPrice}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                    %{product.discountPercent}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuickBuy(product)}
                    aria-label="Satın Al"
                    title="Satın Al"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-blue-700 shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800"
                  >
                    <ShoppingBagIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
