"use client";

import Link from "next/link";
import type { Product } from "@/lib/products";
import { categoryLabels } from "@/lib/products";
import { ArrowUpRightIcon, CheckIcon } from "@heroicons/react/24/outline";

type PopularProductsSliderProps = {
  products: Product[];
};

export default function PopularProductsSlider({
  products,
}: PopularProductsSliderProps) {
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
    <section className="bg-white px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-32">
      <div className="!mx-auto max-w-[1400px]">

        {/* ÜST BAŞLIK */}
        <div className="flex flex-col justify-between gap-8 border-b border-[#e8e5df] pb-10 md:flex-row md:items-end">

          <div>
            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.3em] text-[#9b958d]">
              ANKAROM / KOLEKSİYON
            </p>

            <h2 className="max-w-[700px] text-4xl font-medium leading-[1.16] tracking-[-0.035em] text-[#181818] sm:text-5xl lg:text-[58px]">
              Öne çıkan
              <br />
              <span className="text-[#aaa49c]">
                modellerimiz.
              </span>
            </h2>
          </div>

          <div className="max-w-[390px]">
            <p className="text-sm leading-8 text-[#77716f]">
              Farklı taşıma ihtiyaçları için geliştirilen Ankarom
              römorklarını inceleyin. Her model, kullanım amacına uygun
              dayanıklılık ve işlevsellik sunar.
            </p>
          </div>
        </div>

        {/* ÜRÜNLER */}
        <div className="mt-14 grid gap-x-8 gap-y-20 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <article
              key={product.id}
              className="group"
            >
              {/* GÖRSEL */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[#f5f4f1]">

                {product.imageUrl ? (
                  <>
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                    />

                    {product.images?.[1] && (
                      <img
                        src={product.images[1]}
                        alt={`${product.name} detay`}
                        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      />
                    )}
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center text-[#c4c0b9]">
                    Görsel Yok
                  </div>
                )}

                {/* Görsel üzerindeki kategori */}
                <div className="absolute left-5 top-5">
                  <span className="bg-white/95 px-3 py-2 text-[9px] font-medium uppercase tracking-[0.18em] text-[#4a4641] backdrop-blur-sm">
                    {categoryLabels[product.category]}
                  </span>
                </div>

                {/* Sağ üst ok */}
                <Link
                  href={`/urunler/${product.id}`}
                  aria-label={`${product.name} ürününü incele`}
                  className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center bg-white text-[#24211e] opacity-0 transition-all duration-300 group-hover:bg-[#edf3fa] group-hover:text-[#52749b] group-hover:opacity-100"
                >
                  <ArrowUpRightIcon className="h-4 w-4" />
                </Link>
              </div>

              {/* ÜRÜN BİLGİSİ */}
              <div className="pt-7">

                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="mb-3 text-[9px] uppercase tracking-[0.22em] text-[#aaa49d]">
                      {String(index + 1).padStart(2, "0")} / ANKAROM
                    </p>

                    <h3 className="text-[22px] font-medium leading-8 tracking-[-0.02em] text-[#22201e]">
                      {product.name}
                    </h3>
                  </div>

                  {product.price > 0 && (
                    <span className="pt-1 text-sm font-medium whitespace-nowrap text-[#4a4641]">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>

                {/* İnce çizgi */}
                <div className="mt-6 h-px w-full bg-[#e8e5df] transition-colors duration-300 group-hover:bg-[#8ea8c7]" />

                {/* ÖZELLİKLER */}
                <div className="mt-6">
                  {product.features && product.features.length > 0 ? (
                    <div className="space-y-6">
                      {product.features.slice(0, 2).map((feature, idx) => {
                        const splitIndex = feature.indexOf(":");
                        const hasTitle = splitIndex !== -1;

                        const title = hasTitle
                          ? feature.substring(0, splitIndex)
                          : "";

                        const desc = hasTitle
                          ? feature.substring(splitIndex + 1).trim()
                          : feature;

                        return (
                          <div
                            key={idx}
                            className="flex items-start gap-2.5"
                          >
                            <CheckIcon className="mt-1 h-3.5 w-3.5 shrink-0 stroke-[1.4] text-[#9b958d] transition-colors group-hover:text-[#52749b]" />

                            <p className="text-[12px] leading-7 text-[#77716f]">
                              {hasTitle && (
                                <span className="font-medium text-[#48443f]">
                                  {title}:{" "}
                                </span>
                              )}

                              {desc}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-[12px] leading-7 text-[#77716f]">
                      {product.description}
                    </p>
                  )}
                </div>

                {/* ÜRÜN DETAY */}
                <Link
                  href={`/urunler/${product.id}`}
                  className="mt-8 inline-flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.22em] text-[#282522] transition-colors duration-300 hover:text-[#52749b]"
                >
                  Ürünü İncele

                  <ArrowUpRightIcon className="h-3.5 w-3.5 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#52749b]" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* ALT CTA */}
        <div className="!mx-auto mt-24 flex max-w-3xl flex-col items-center gap-8 border-t border-[#e8e5df] pt-9 text-center">

          <div className="max-w-[600px]">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#aaa49d]">
              TÜM MODELLER
            </p>

            <p className="mt-4 text-sm leading-8 text-[#77716f]">
              Ankarom ürün kataloğunun tamamını inceleyin.
            </p>
          </div>

          <Link
            href="/urunler"
            className="group inline-flex items-center gap-5 border border-[#1e344f] bg-white px-7 py-4 text-[9px] font-medium uppercase tracking-[0.22em] text-[#1e344f] transition-all duration-300 hover:border-[#1e344f] hover:bg-[#1e344f] !hover:text-[#ffffff]"
          >
            Tüm Kataloğu Gör

            <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}