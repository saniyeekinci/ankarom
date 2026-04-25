"use client";

import React from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import type { Product } from "@/lib/products";
import { categoryLabels } from "@/lib/products";

type ProductListingProps = {
  products: Product[];
};

export default function ProductListing({ products }: ProductListingProps) {
  return (
    <div className="w-full">
      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => {
            const imageSrc = product.images?.[0] || product.imageUrl;
            const secondImage = product.images?.[1];

            return (
              <div
                key={product.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 hover:border-slate-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
              >
                {/* Görsel Alanı */}
                <Link
                  href={`/urunler/${product.id}`}
                  className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b border-slate-100 bg-slate-50/50"
                >
                  {imageSrc ? (
                    <>
                      <img
                        src={imageSrc}
                        alt={product.name}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {secondImage && (
                        <img
                          src={secondImage}
                          alt={`${product.name} Detay`}
                          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        />
                      )}
                    </>
                  ) : (
                    <div className="text-sm font-medium text-slate-300">Görsel Bekleniyor</div>
                  )}
                  <div className="absolute inset-0 bg-slate-900/0 transition-colors duration-300 group-hover:bg-slate-900/5" />
                </Link>

                {/* İçerik Alanı */}
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3">
                    <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                      {product.category ? categoryLabels[product.category] : "Kurumsal Seri"}
                    </span>
                  </div>

                  <Link href={`/urunler/${product.id}`}>
                    <h3 className="mb-2 line-clamp-2 text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-blue-600">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="mb-6 flex-1 line-clamp-2 text-sm leading-relaxed text-slate-500">
                    {product.description}
                  </p>

                {/* Alt Kısım: İncele Butonu - Kesin Çözüm */}
<div className="mt-auto border-t border-slate-100 pt-5">
  <Link
    href={`/urunler/${product.id}`}
    className="flex w-full h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 transition-all duration-300 hover:bg-blue-700 active:scale-[0.98] group/btn"
  >
    {/* text-white! yazarak rengi zorla beyaz yapıyoruz */}
    <span className="text-white! font-bold text-sm">İncele</span>
    <ArrowRightIcon className="h-4 w-4 text-white! transition-transform group-hover/btn:translate-x-1" />
  </Link>
</div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <p className="text-slate-500">Bu katalogda henüz ürün bulunmuyor.</p>
        </div>
      )}
    </div>
  );
}