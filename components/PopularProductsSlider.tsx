"use client";

import Link from "next/link";
import type { Product } from "@/lib/products";
import { categoryLabels } from "@/lib/products";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

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

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-28 bg-gradient-to-b from-white to-slate-100 flex justify-center">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-center gap-10 px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 space-y-5 text-center">
          <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-blue-600">
            Ankarom Showcase
          </span>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            VİTRİN ÜRÜNLERİ
          </h2>
          <p className="mx-auto max-w-xl text-lg text-slate-500">
            Sertifikalı, yüksek performanslı ve modern araç taşıma çözümleri.
          </p>
        </div>

        {/* Grid */}
        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative flex flex-col overflow-hidden  rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
            >
              {/* Image Area */}
              <div className="relative flex aspect-[4/3] shrink-0 items-center justify-center overflow-hidden bg-slate-50">
                {product.imageUrl ? (
                  <>
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {product.images?.[1] && (
                      <img
                        src={product.images[1]}
                        alt={`${product.name} Detay`}
                        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      />
                    )}
                  </>
                ) : (
                  <svg className="h-16 w-16 text-slate-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 7h-3V6a4 4 0 00-8 0v1H5a2 2 0 00-2 2v7a2 2 0 002 2h1.1a3 3 0 005.8 0h4.2a3 3 0 005.8 0H21a2 2 0 002-2V9a2 2 0 00-2-2zM10 6a2 2 0 014 0v1h-4V6zm-2 12a1 1 0 11-2 0 1 1 0 012 0zm10 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                )}

                {/* Category Badge */}
                <div className="absolute left-4 top-4 z-10">
                  <span className="rounded-lg border border-slate-100 bg-white/90 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-800 shadow-sm backdrop-blur-md">
                    {categoryLabels[product.category]}
                  </span>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <h3 className="mb-6 line-clamp-2 text-2xl font-black leading-tight text-slate-900 transition-colors group-hover:text-blue-600">
                  {product.name}
                </h3>

                {/* --- JSON'DAN GELEN ÖZELLİKLER BURADA İŞLENİYOR --- */}
                <div className="mb-8 flex flex-1 flex-col gap-4">
                  {product.features && product.features.length > 0 ? (
                    product.features.slice(0, 2).map((feature, idx) => {
                      // İki noktaya (:) göre metni başlık ve açıklama olarak bölüyoruz
                      const splitIndex = feature.indexOf(":");
                      const hasTitle = splitIndex !== -1;
                      const title = hasTitle ? feature.substring(0, splitIndex) : "";
                      const desc = hasTitle ? feature.substring(splitIndex + 1).trim() : feature;

                      return (
                        <div key={idx} className="flex items-start gap-3">
                          <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
                          <p className="text-sm leading-relaxed text-slate-600">
                            {hasTitle ? (
                              <>
                                <span className="font-bold text-slate-900">{title}:</span> {desc}
                              </>
                            ) : (
                              <span>{desc}</span>
                            )}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-slate-500">{product.description}</p>
                  )}
                </div>

                
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-6">
          <Link
            href="/urunler"
            className="group inline-flex items-center gap-3 rounded-full border-2 border-slate-200 bg-white px-8 py-4 font-bold text-slate-900 transition-all hover:border-blue-600 hover:text-blue-600 hover:shadow-lg"
          >
            TÜM KATALOĞU GÖR
            <span className="transition-transform duration-300 group-hover:translate-x-1.5">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}