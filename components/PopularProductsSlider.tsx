"use client";

import Link from "next/link";
import type { Product } from "@/lib/products";
import { categoryLabels } from "@/lib/products";

type PopularProductsSliderProps = {
  products: Product[];
};

export default function PopularProductsSlider({ products }: PopularProductsSliderProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Fallback: eğer ürün yoksa boş gösterin
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-28 bg-gradient-to-b from-white to-slate-100">
      <div className="flex flex-col items-center justify-center gap-10 max-w-8xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20 space-y-5">
          <span className="text-blue-600 font-bold tracking-[0.3em] text-xs uppercase">
            Ankarom Showcase
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
            VİTRİN ÜRÜNLERİ
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-lg">
            Sertifikalı, yüksek performanslı ve modern araç taşıma çözümleri.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-3"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 flex items-center justify-center">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <svg
                    className="w-24 h-24 text-slate-300"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 7h-3V6a4 4 0 00-8 0v1H5a2 2 0 00-2 2v7a2 2 0 002 2h1.1a3 3 0 005.8 0h4.2a3 3 0 005.8 0H21a2 2 0 002-2V9a2 2 0 00-2-2zM10 6a2 2 0 014 0v1h-4V6zm-2 12a1 1 0 11-2 0 1 1 0 012 0zm10 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent opacity-60"></div>

                {/* Category */}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/80 backdrop-blur-md text-slate-900 text-[11px] font-semibold px-3 py-1 rounded-full shadow">
                    {categoryLabels[product.category]}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-7 flex flex-col h-full">
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition line-clamp-2">
                  {product.name}
                </h3>

                <p className="text-slate-500 text-sm leading-relaxed mb-5 flex-grow line-clamp-2">
                  {product.description}
                </p>

                {/* Specs: Capacity + Stock Status */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.capacity && (
                    <span className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-1 rounded-md font-semibold tracking-wide">
                      {product.capacity}
                    </span>
                  )}
                  <span className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-1 rounded-md font-semibold tracking-wide">
                    {product.stockStatus}
                  </span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <p className="text-2xl font-bold text-slate-900">
                    {formatPrice(product.discountPrice ?? product.price)}
                  </p>
                  {product.discountPrice && (
                    <p className="text-xs text-slate-500 line-through">
                      {formatPrice(product.price)}
                    </p>
                  )}
                </div>

                {/* Button */}
                <Link
                  href={`/urunler/${product.id}`}
                  className="relative overflow-hidden w-full py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-slate-900 to-slate-700 hover:from-blue-600 hover:to-blue-500 transition-all duration-300 shadow-lg group-hover:shadow-blue-200 inline-flex items-center justify-center"
                >
                  <span className="relative z-10">DETAYLARI İNCELE</span>

                  {/* Glow effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-white/10 blur-xl"></div>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <Link
          href="/urunler"
          className="group inline-flex items-center gap-2 text-slate-900 font-bold text-lg"
        >
          TÜM KATALOĞU GÖR
          <span className="transition-transform group-hover:translate-x-2">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
