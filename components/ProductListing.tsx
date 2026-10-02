"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ArrowUpRightIcon, CheckIcon, ShoppingBagIcon, TruckIcon } from "@heroicons/react/24/outline";
import type { Product } from "@/lib/products";
import { categoryLabels } from "@/lib/products";
import { useCart } from "@/components/cart/CartProvider";
import {
  catalogActionStyle,
  setCatalogActionAppearance,
} from "@/lib/catalogAction";

type ProductListingProps = {
  products: Product[];
};

export default function ProductListing({ products }: ProductListingProps) {
  const { addToCart } = useCart();
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div className="catalog-page w-full">
      <header className="mx-auto mb-12 flex max-w-3xl flex-col items-center gap-5 text-center sm:mb-14" style={{ marginInline: "auto" }}>
        <div className="flex items-center gap-4">
          <span className="h-px w-9 bg-[#8ea8c7]" />
          <p className="catalog-meta text-[9px] font-medium uppercase tracking-[0.3em] text-[#858078]" style={{ color: "#718077" }}>
            ANKAROM / KOLEKSİYON
          </p>
          <span className="h-px w-9 bg-[#8ea8c7]" />
        </div>
        <h1 className="text-[34px] font-medium leading-tight text-[#202522] sm:text-[44px]">
          Ürün kataloğu
        </h1>
        <p className="catalog-muted max-w-2xl text-[14px] leading-8 text-[#68716b]" style={{ color: "#68716b" }}>
          Güvenli taşıma için tasarlanan römorkları ve donanımları inceleyin.
        </p>
        <p className="catalog-meta border-y border-[#dedbd4] px-5 py-2 text-[10px] font-medium uppercase tracking-[0.16em] text-[#718077]" style={{ color: "#718077" }}>
          {products.length} ürün
        </p>
      </header>

      {products.length > 0 ? (
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-7 md:grid-cols-2 lg:gap-9" style={{ marginInline: "auto" }}>
          {products.map((product, index) => {
            const imageSrc = product.images?.[0] || product.imageUrl;
            const isAdded = addedProductId === product.id;

            return (
              <div
                key={product.id}
                className="group flex flex-col overflow-hidden border border-[#e1dfd8] bg-white transition-colors duration-300 hover:border-[#aeb9b1]"
              >
                <Link
                  href={`/urunler/${product.id}`}
                  className="relative flex aspect-[16/10] items-center justify-center overflow-hidden border-b border-[#e8e5df] bg-[#efeee9]"
                  aria-label={`${product.name} ürün detayını incele`}
                >
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={product.name}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <span className="text-sm text-[#8b918b]">Görsel hazırlanıyor</span>
                  )}
                  {product.certification && (
                    <span className="absolute left-4 top-4 border border-[#dedbd4] bg-[#fbfaf7] px-3 py-2 text-[9px] font-medium uppercase tracking-[0.18em] text-[#1e344f] sm:left-5 sm:top-5">
                      {product.certification} / Belgeli
                    </span>
                  )}
                  <span className="absolute bottom-4 right-4 text-[9px] font-medium uppercase tracking-[0.16em] text-[#858078]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </Link>

                <div className="flex flex-1 flex-col p-5 sm:p-7">
                  <div className="flex items-center justify-between gap-4">
                    <span className="catalog-meta text-[9px] font-medium uppercase tracking-[0.18em] text-[#718077]" style={{ color: "#718077" }}>
                      {product.category ? categoryLabels[product.category] : "Römork"}
                    </span>
                    <span className="catalog-meta text-right text-[9px] uppercase tracking-[0.12em] text-[#858d86]" style={{ color: "#858d86" }}>
                      {product.stockStatus}
                    </span>
                  </div>

                  <Link href={`/urunler/${product.id}`} className="mt-5 w-fit max-w-full">
                    <h2 className="line-clamp-2 text-[23px] font-medium leading-snug text-[#202522] transition-colors group-hover:text-[#1e344f] sm:text-[26px]">
                      {product.name}
                    </h2>
                  </Link>

                  <p className="catalog-muted mt-4 line-clamp-3 text-[13px] leading-7 text-[#68716b]" style={{ color: "#68716b" }}>
                    {product.description}
                  </p>

                  {product.deliveryInfo && (
                    <div className="catalog-muted mt-5 flex items-center gap-2 border-y border-[#eeece7] py-3 text-[11px] leading-6 text-[#777f78]" style={{ color: "#777f78" }}>
                      <TruckIcon className="h-4 w-4 shrink-0 text-[#718077]" />
                      {product.deliveryInfo}
                    </div>
                  )}

                  <div className="mt-auto flex flex-col gap-5 border-t border-[#e8e5df] pt-6">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="catalog-subtle text-[9px] font-medium uppercase tracking-[0.18em] text-[#858d86]" style={{ color: "#858d86" }}>
                          Satış fiyatı
                        </p>
                        <p className="mt-2 text-[27px] font-semibold leading-none text-[#202522]">
                          {formatPrice(product.discountPrice ?? product.price)}
                        </p>
                      </div>
                      {product.deliveryInfo && (
                        <span className="text-right text-[9px] uppercase tracking-[0.12em] text-[#858d86]">
                          Fabrikadan teslim
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        href={`/urunler/${product.id}`}
                        className="catalog-action inline-flex min-h-12 items-center justify-center gap-2 border border-[#1e344f] bg-white px-3 py-3 text-center text-[9px] font-medium uppercase tracking-[0.14em]"
                        aria-label={`${product.name} detayları`}
                        onMouseEnter={(event) => setCatalogActionAppearance(event.currentTarget, true)}
                        onMouseLeave={(event) => setCatalogActionAppearance(event.currentTarget, false)}
                        onFocus={(event) => setCatalogActionAppearance(event.currentTarget, true)}
                        onBlur={(event) => setCatalogActionAppearance(event.currentTarget, false)}
                        style={catalogActionStyle}
                      >
                        Detaylar
                        <ArrowUpRightIcon className="h-3.5 w-3.5 shrink-0" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          addToCart(product);
                          setAddedProductId(product.id);
                        }}
                        className="catalog-action inline-flex min-h-12 items-center justify-center gap-2 border border-[#1e344f] bg-white px-3 py-3 text-center text-[9px] font-medium uppercase tracking-[0.14em]"
                        onMouseEnter={(event) => setCatalogActionAppearance(event.currentTarget, true)}
                        onMouseLeave={(event) => setCatalogActionAppearance(event.currentTarget, false)}
                        onFocus={(event) => setCatalogActionAppearance(event.currentTarget, true)}
                        onBlur={(event) => setCatalogActionAppearance(event.currentTarget, false)}
                        style={catalogActionStyle}
                      >
                        {isAdded ? (
                          <CheckIcon className="h-3.5 w-3.5 shrink-0" />
                        ) : (
                          <ShoppingBagIcon className="h-3.5 w-3.5 shrink-0" />
                        )}
                        {isAdded ? "Eklendi" : "Sepete ekle"}
                        <ArrowRightIcon className="h-3.5 w-3.5 shrink-0" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center border border-dashed border-[#d4d7d2] bg-white py-16 text-center">
          <p className="text-[#68716b]">Bu katalogda henüz ürün bulunmuyor.</p>
        </div>
      )}
    </div>
  );
}