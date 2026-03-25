"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { useAuth } from "@/components/auth/AuthProvider";
import { trailerProducts, type TrailerProduct } from "@/lib/trailerProducts";
import { mapBackendProductToTrailerProduct, type BackendProduct } from "@/lib/productMapper";

const FAVORITES_STORAGE_KEY = "ankarom-favorite-product-ids";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function FavoritesPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [allProducts, setAllProducts] = useState<TrailerProduct[]>(trailerProducts);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw) as string[];
      return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/giris");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
    }
  }, [favoriteIds]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products`, {
          cache: "no-store",
        });

        if (!response.ok) {
          setAllProducts(trailerProducts);
          return;
        }

        const data = (await response.json()) as BackendProduct[] | { products?: BackendProduct[] };
        const productsList: BackendProduct[] | undefined = Array.isArray(data) ? data : data.products;

        if (!productsList || productsList.length === 0) {
          setAllProducts(trailerProducts);
          return;
        }

        setAllProducts(productsList.map(mapBackendProductToTrailerProduct));
      } catch {
        setAllProducts(trailerProducts);
      }
    };

    loadProducts();
  }, []);

  const favorites = useMemo(() => {
    const idSet = new Set(favoriteIds);
    return allProducts.filter((product) => idSet.has(product.id));
  }, [allProducts, favoriteIds]);

  const removeFavorite = (productId: string) => {
    setFavoriteIds((prev) => prev.filter((id) => id !== productId));
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <section className="relative overflow-hidden px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="pointer-events-none absolute -left-20 top-8 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className=" flex flex-col gap-4 relative mx-auto w-full max-w-360 space-y-6">
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.55)] backdrop-blur-2xl sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <HeartIcon className="h-5 w-5 text-cyan-300" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Hesabım</p>
                <h1 className="mt-1 text-2xl font-black text-white">Favorilerim</h1>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Geri
            </button>
          </div>
        </div>

        {favorites.length === 0 ? (
          <article className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 text-center shadow-[0_20px_60px_rgba(2,6,23,0.55)] backdrop-blur-2xl">
            <p className="text-lg font-bold text-white">Henüz favori ürünün yok.</p>
            <p className="mt-2 text-sm text-slate-400">Ürünler sayfasında kalp ikonuna basarak favori ekleyebilirsin.</p>
            <Link
              href="/urunler"
              className="mt-5 inline-flex items-center rounded-xl bg-linear-to-r from-indigo-500 to-cyan-500 px-5 py-3 text-sm font-bold text-white"
            >
              Ürünlere Git
            </Link>
          </article>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favorites.map((product) => (
              <article
                key={product.id}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-b from-slate-900/75 to-slate-950/80 p-3 shadow-[0_18px_50px_rgba(2,6,23,0.5)] backdrop-blur-xl"
              >
                <button
                  type="button"
                  onClick={() => removeFavorite(product.id)}
                  aria-label="Favorilerden çıkar"
                  className="absolute right-5 top-5 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-rose-300/50 bg-rose-500/20 text-rose-200"
                >
                  <HeartSolidIcon className="h-4 w-4" />
                </button>

                <Link href={`/urunler/${product.id}`} className="block overflow-hidden rounded-2xl border border-white/10">
                  <div className="relative aspect-4/3 overflow-hidden">
                    <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                </Link>

                <div className="px-1 pb-2 pt-4">
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
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
