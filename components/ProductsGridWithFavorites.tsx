"use client";

import Image from "next/image";
import Link from "next/link";
import { TruckIcon } from "@heroicons/react/24/outline";
import type { TrailerProduct } from "@/lib/trailerProducts";



type ProductsGridWithFavoritesProps = {
  products: TrailerProduct[];
};

export default function ProductsGridWithFavorites({ products }: ProductsGridWithFavoritesProps) {

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => {
        return (
          <article
            key={product.id}
            className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200"
          >
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

              <div className="mt-4">
                <p className="text-xl font-extrabold text-slate-900">{product.currentPrice}</p>
                <p className="mt-1 text-xs text-slate-500 line-through">{product.oldPrice}</p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
