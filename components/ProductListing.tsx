"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon, CheckIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import type { Product } from "@/lib/products";
import { categoryLabels } from "@/lib/products";
import { useCart } from "@/components/cart/CartProvider";

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
    <div className="w-full">
      <div className="mb-10 flex flex-col justify-between gap-5 border-b border-[#dedbd4] pb-7 sm:flex-row sm:items-end">
        <div>
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#718077]">
            ANKAROM / RÖMORK KOLEKSİYONU
          </p>
          <h1 className="text-[34px] font-medium leading-tight text-[#202522] sm:text-[42px]">
            Ürün kataloğu
          </h1>
          <p className="mt-3 max-w-xl text-[14px] leading-7 text-[#68716b]">
            Belgeli taşıma çözümlerini inceleyin ve ihtiyacınıza uygun ürünü sepetinize ekleyin.
          </p>
        </div>
        <p className="text-[12px] font-medium uppercase tracking-[0.15em] text-[#7c857e]">
          {products.length} ürün
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:gap-8">
          {products.map((product, index) => {
            const imageSrc = product.images?.[0] || product.imageUrl;
            const isAdded = addedProductId === product.id;

            return (
              <div
                key={product.id}
                className="group flex flex-col overflow-hidden border border-[#e2dfd8] bg-white transition-colors duration-300 hover:border-[#bfc9c0]"
              >
                <Link
                  href={`/urunler/${product.id}`}
                  className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b border-[#e8e5df] bg-[#f5f4f0]"
                  aria-label={`${product.name} ürün detayını incele`}
                >
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={product.name}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain p-5 transition-transform duration-500 group-hover:scale-[1.03] sm:p-8"
                    />
                  ) : (
                    <span className="text-sm text-[#8b918b]">Görsel hazırlanıyor</span>
                  )}
                  {product.certification && (
                    <span className="absolute left-5 top-5 bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#29483c] shadow-sm">
                      {product.certification} Belgeli
                    </span>
                  )}
                </Link>

                <div className="flex flex-1 flex-col p-5 sm:p-7">
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#858d86]">
                      {product.category ? categoryLabels[product.category] : "Römork"}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.12em] text-[#858d86]">
                      Fabrikadan teslim
                    </span>
                  </div>

                  <Link href={`/urunler/${product.id}`} className="w-fit max-w-full">
                    <h2 className="line-clamp-2 text-[22px] font-medium leading-snug text-[#202522] transition-colors group-hover:text-[#547261] sm:text-[25px]">
                      {product.name}
                    </h2>
                  </Link>

                  <p className="mt-3 min-h-14 text-[13px] leading-7 text-[#68716b]">
                    {product.description}
                  </p>

                  {product.deliveryInfo && (
                    <p className="mt-4 border-t border-[#eeece7] pt-4 text-[11px] text-[#777f78]">
                      {product.deliveryInfo}
                    </p>
                  )}

                  <div className="mt-auto border-t border-[#e8e5df] pt-5">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#858d86]">
                          Satış fiyatı
                        </p>
                        <p className="mt-2 text-[25px] font-semibold leading-none text-[#202522]">
                          {formatPrice(product.discountPrice ?? product.price)}
                        </p>
                      </div>
                      <Link
                        href={`/urunler/${product.id}`}
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-[#d8d3ca] text-[#5d665f] transition-colors hover:border-[#29483c] hover:text-[#29483c]"
                        aria-label={`${product.name} detayları`}
                        title="Ürün detayları"
                      >
                        <ArrowUpRightIcon className="h-4 w-4" />
                      </Link>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        addToCart(product);
                        setAddedProductId(product.id);
                      }}
                      className={`mt-5 flex h-12 w-full items-center justify-center gap-2 text-[12px] font-semibold uppercase tracking-[0.1em] transition-colors ${
                        isAdded
                          ? "bg-[#e8eee9] text-[#29483c]"
                          : "bg-[#29483c] text-white hover:bg-[#203b31]"
                      }`}
                    >
                      {isAdded ? (
                        <CheckIcon className="h-4 w-4" />
                      ) : (
                        <ShoppingBagIcon className="h-4 w-4" />
                      )}
                      {isAdded ? "Sepete Eklendi" : "Sepete Ekle"}
                    </button>
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