"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { HeartIcon as HeartOutlineIcon, TruckIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import type { TrailerProduct } from "@/lib/trailerProducts";

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

  const toggleFavorite = (productId: string) => {
    const next = favoriteIdSet.has(productId)
      ? favoriteIds.filter((id) => id !== productId)
      : [...favoriteIds, productId];

    writeFavoriteIds(next);
  };

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => {
        const isFavorite = favoriteIdSet.has(product.id);

        return (
          <article
            key={product.id}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-b from-slate-900/75 to-slate-950/80 p-3 shadow-[0_18px_50px_rgba(2,6,23,0.5)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
          >
            <button
              type="button"
              onClick={() => toggleFavorite(product.id)}
              aria-label={isFavorite ? "Favorilerden çıkar" : "Favoriye ekle"}
              className={`absolute right-5 top-5 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border text-slate-200 transition-colors ${
                isFavorite
                  ? "border-rose-300/50 bg-rose-500/20 text-rose-200"
                  : "border-white/20 bg-slate-900/75 hover:bg-slate-800"
              }`}
            >
              {isFavorite ? <HeartSolidIcon className="h-4 w-4" /> : <HeartOutlineIcon className="h-4 w-4" />}
            </button>

            <Link href={`/urunler/${product.id}`} className="block overflow-hidden rounded-2xl border border-white/10">
              <div className="relative aspect-4/3 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/65 to-transparent" />
              </div>
            </Link>

            <div className="px-1 pb-2 pt-4">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/35 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                <TruckIcon className="h-4 w-4" />
                <span>{product.deliveryText}</span>
              </div>

              <Link href={`/urunler/${product.id}`} className="block">
                <h2 className="line-clamp-2 text-base font-bold leading-snug text-white transition-colors group-hover:text-cyan-200">
                  {product.name}
                </h2>
              </Link>

              <div className="mt-4 flex items-end justify-between gap-3">
                <div>
                  <p className="text-xl font-extrabold text-white">{product.currentPrice}</p>
                  <p className="mt-1 text-xs text-slate-500 line-through">{product.oldPrice}</p>
                </div>
                <span className="rounded-full border border-orange-300/40 bg-linear-to-r from-rose-500/20 to-orange-500/20 px-2.5 py-1 text-xs font-bold text-orange-300">
                  %{product.discountPercent}
                </span>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
