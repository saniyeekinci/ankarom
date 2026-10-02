"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useCart } from "@/components/cart/CartProvider";
import { getCatalogOnlyProducts } from "@/lib/products";
import {
  catalogActionStyle,
  setCatalogActionAppearance,
} from "@/lib/catalogAction";

const exampleProduct = getCatalogOnlyProducts()[0];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);

export default function CartPage() {
  const { items, itemCount, subtotal, updateQuantity, removeFromCart } = useCart();
  const [hasRemovedCartContents, setHasRemovedCartContents] = useState(false);
  const isShowingExample =
    items.length === 0 && !hasRemovedCartContents && Boolean(exampleProduct);
  const displayItems = items.length > 0
    ? items
          : isShowingExample && exampleProduct
    ? [{ ...exampleProduct, quantity: 1 }]
    : [];
  const displayItemCount = isShowingExample ? 1 : itemCount;
  const grandTotal = isShowingExample
    ? exampleProduct?.discountPrice ?? exampleProduct?.price ?? 0
    : subtotal;
  const vat = grandTotal - grandTotal / 1.2;
  const subtotalBeforeVat = grandTotal - vat;

  return (
    <main className="min-h-[70vh] bg-[#f7f7f5] text-[#202522]">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-10 sm:px-8 sm:py-14" style={{ marginInline: "auto" }}>
        <header className="flex flex-col items-center gap-4 border-b border-[#dedfd9] pb-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#718077]">
              ANKAROM / ALIŞVERİŞ
            </p>
            <h1 className="text-[36px] font-medium leading-tight sm:text-[44px]">
              Sepetim
            </h1>
          </div>
          <p className="text-[12px] uppercase tracking-[0.14em] text-[#778078]">
            {displayItemCount} ürün
          </p>
        </header>

        {displayItems.length === 0 ? (
            <div className="flex flex-col items-center gap-4 border border-dashed border-[#cfd5cf] bg-white px-6 py-16 text-center">
              <p className="text-[18px] font-medium text-[#27342c]">
              Sepetiniz şu an boş.
            </p>
            <p className="mt-3 text-[14px] text-[#68716b]">
              Kataloğumuzdan ihtiyacınıza uygun römorku seçebilirsiniz.
            </p>
            <Link
              href="/urunler"
              className="catalog-action mt-7 inline-flex items-center gap-5 border border-[#1e344f] bg-white px-7 py-4 text-[9px] font-medium uppercase tracking-[0.22em]"
              onMouseEnter={(event) => setCatalogActionAppearance(event.currentTarget, true)}
              onMouseLeave={(event) => setCatalogActionAppearance(event.currentTarget, false)}
              onFocus={(event) => setCatalogActionAppearance(event.currentTarget, true)}
              onBlur={(event) => setCatalogActionAppearance(event.currentTarget, false)}
              style={catalogActionStyle}
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Ürün kataloğuna dön
            </Link>
          </div>
        ) : (
          <div className="mx-auto grid max-w-5xl gap-9 lg:grid-cols-[minmax(0,1fr)_330px] lg:gap-12" style={{ marginInline: "auto" }}>
            <section aria-label="Sepetteki ürünler" className="divide-y divide-[#e0e2dc] border-y border-[#d9ddd8]">
              {displayItems.map((item) => {
                const unitPrice = item.discountPrice ?? item.price;

                return (
                  <article
                    key={item.id}
                    className="grid gap-5 py-6 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-7 sm:py-8"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden border border-[#e7e5df] bg-[#f0efeb]">
                      <Image
                        src={item.images?.[0] || item.imageUrl || "/romork.png"}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 180px"
                        className="object-contain p-3"
                      />
                    </div>

                    <div className="flex min-w-0 flex-col justify-between gap-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-2">
                          {isShowingExample && (
                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1d4ed8]">
                              Örnek ürün
                            </p>
                          )}
                          {item.certification && (
                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#718077]">
                              {item.certification} Belgeli
                            </p>
                          )}
                          <h2 className="text-[19px] font-medium leading-snug text-[#27342c] sm:text-[21px]">
                            {item.name}
                          </h2>
                          <p className="text-[13px] leading-6 text-[#68716b]">
                            Birim fiyat: {formatPrice(unitPrice)}
                          </p>
                        </div>
                        {!isShowingExample && (
                          <button
                            type="button"
                            onClick={() => {
                              setHasRemovedCartContents(true);
                              removeFromCart(item.id);
                            }}
                            className="catalog-action flex h-10 w-10 shrink-0 items-center justify-center border border-[#1e344f] bg-white text-[#1e344f]"
                            aria-label={`${item.name} ürününü sepetten çıkar`}
                            title="Ürünü kaldır"
                            onMouseEnter={(event) => setCatalogActionAppearance(event.currentTarget, true)}
                            onMouseLeave={(event) => setCatalogActionAppearance(event.currentTarget, false)}
                            onFocus={(event) => setCatalogActionAppearance(event.currentTarget, true)}
                            onBlur={(event) => setCatalogActionAppearance(event.currentTarget, false)}
                            style={catalogActionStyle}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      <div className="flex flex-wrap items-end justify-between gap-4">
                        {isShowingExample ? (
                          <span className="text-[12px] text-[#7a817b]">1 adet · Örnek ürün</span>
                        ) : (
                          <div className="inline-flex h-10 items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                if (item.quantity === 1) {
                                  setHasRemovedCartContents(true);
                                }
                                updateQuantity(item.id, item.quantity - 1);
                              }}
                              className="catalog-action flex h-9 w-9 items-center justify-center border border-[#1e344f] bg-white text-[#1e344f]"
                              aria-label={`${item.name} adedini azalt`}
                              onMouseEnter={(event) => setCatalogActionAppearance(event.currentTarget, true)}
                              onMouseLeave={(event) => setCatalogActionAppearance(event.currentTarget, false)}
                              onFocus={(event) => setCatalogActionAppearance(event.currentTarget, true)}
                              onBlur={(event) => setCatalogActionAppearance(event.currentTarget, false)}
                              style={catalogActionStyle}
                            >
                              <MinusIcon className="h-3.5 w-3.5" />
                            </button>
                            <span className="min-w-9 text-center text-[13px] font-medium tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="catalog-action flex h-9 w-9 items-center justify-center border border-[#1e344f] bg-white text-[#1e344f]"
                              aria-label={`${item.name} adedini artır`}
                              onMouseEnter={(event) => setCatalogActionAppearance(event.currentTarget, true)}
                              onMouseLeave={(event) => setCatalogActionAppearance(event.currentTarget, false)}
                              onFocus={(event) => setCatalogActionAppearance(event.currentTarget, true)}
                              onBlur={(event) => setCatalogActionAppearance(event.currentTarget, false)}
                              style={catalogActionStyle}
                            >
                              <PlusIcon className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                        <p className="text-[18px] font-semibold tabular-nums text-[#202522]">
                          {formatPrice(unitPrice * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>

            <aside className="flex h-fit flex-col gap-5 border border-[#e0e2dc] bg-white p-6 sm:p-7 lg:sticky lg:top-28">
              <h2 className="text-[17px] font-medium text-[#27342c]">
                Sipariş özeti
              </h2>
              <div className="flex items-center justify-between border-t border-[#e8e9e4] pt-5">
                <span className="text-[13px] text-[#68716b]">
                  Ara toplam
                </span>
                <span className="text-[14px] font-medium tabular-nums text-[#27342c]">
                  {formatPrice(subtotalBeforeVat)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-[#e8e9e4] pt-4 text-[13px] text-[#68716b]">
                <span>KDV (%20)</span>
                <span className="font-medium tabular-nums text-[#27342c]">
                  {formatPrice(vat)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-[#e8e9e4] pt-5">
                <span className="text-[14px] font-medium text-[#27342c]">
                  Genel toplam
                </span>
                <span className="text-[21px] font-semibold tabular-nums text-[#202522]">
                  {formatPrice(grandTotal)}
                </span>
              </div>
              <p className="text-[11px] leading-6 text-[#7a817b]">
                Ürün fiyatlarına KDV dahildir. Teslimat ayrıntıları ödeme adımında netleştirilir.
              </p>
              <Link
                href="/odeme"
                className="catalog-action flex w-full items-center justify-center gap-5 border border-[#1e344f] bg-white px-7 py-4 text-center text-[9px] font-medium uppercase tracking-[0.22em]"
                onMouseEnter={(event) => setCatalogActionAppearance(event.currentTarget, true)}
                onMouseLeave={(event) => setCatalogActionAppearance(event.currentTarget, false)}
                onFocus={(event) => setCatalogActionAppearance(event.currentTarget, true)}
                onBlur={(event) => setCatalogActionAppearance(event.currentTarget, false)}
                style={catalogActionStyle}
              >
                Ödeme Adımına Geç
                <ArrowRightIcon className="h-4 w-4 shrink-0" />
              </Link>
              <Link
                href="/urunler"
                className="catalog-action flex w-full items-center justify-center gap-5 border border-[#1e344f] bg-white px-7 py-4 text-center text-[9px] font-medium uppercase tracking-[0.22em]"
                onMouseEnter={(event) => setCatalogActionAppearance(event.currentTarget, true)}
                onMouseLeave={(event) => setCatalogActionAppearance(event.currentTarget, false)}
                onFocus={(event) => setCatalogActionAppearance(event.currentTarget, true)}
                onBlur={(event) => setCatalogActionAppearance(event.currentTarget, false)}
                style={catalogActionStyle}
              >
                Alışverişe devam et
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}