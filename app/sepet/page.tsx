"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowUpRightIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useCart } from "@/components/cart/CartProvider";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);

export default function CartPage() {
  const { items, itemCount, subtotal, updateQuantity, removeFromCart } = useCart();

  const orderMessage = [
    "Merhaba, aşağıdaki ürünler için sipariş vermek istiyorum:",
    ...items.map(
      (item) =>
        `${item.name} x ${item.quantity} - ${formatPrice((item.discountPrice ?? item.price) * item.quantity)}`,
    ),
    `Ara toplam: ${formatPrice(subtotal)}`,
  ].join("\n");

  const whatsappHref = `https://wa.me/905079586868?text=${encodeURIComponent(orderMessage)}`;

  return (
    <main className="min-h-[70vh] bg-[#f7f7f5] text-[#202522]">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-10 sm:py-16 lg:px-16">
        <div className="mb-10 flex flex-col justify-between gap-6 border-b border-[#dedfd9] pb-7 sm:flex-row sm:items-end">
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#718077]">
              ANKAROM / ALIŞVERİŞ
            </p>
            <h1 className="text-[36px] font-medium leading-tight sm:text-[44px]">
              Sepetim
            </h1>
          </div>
          <p className="text-[12px] uppercase tracking-[0.14em] text-[#778078]">
            {itemCount} ürün
          </p>
        </div>

        {items.length === 0 ? (
          <div className="border border-dashed border-[#cfd5cf] bg-white px-6 py-16 text-center">
            <p className="text-[18px] font-medium text-[#27342c]">
              Sepetiniz şu an boş.
            </p>
            <p className="mt-3 text-[14px] text-[#68716b]">
              Kataloğumuzdan ihtiyacınıza uygun römorku seçebilirsiniz.
            </p>
            <Link
              href="/urunler"
              className="mt-7 inline-flex h-11 items-center gap-2 bg-[#29483c] px-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#203b31]"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Ürün kataloğuna dön
            </Link>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_330px] lg:gap-14">
            <section aria-label="Sepetteki ürünler" className="divide-y divide-[#e0e2dc] border-y border-[#d9ddd8]">
              {items.map((item) => {
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
                        <div>
                          {item.certification && (
                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#718077]">
                              {item.certification} Belgeli
                            </p>
                          )}
                          <h2 className="mt-2 text-[19px] font-medium leading-snug text-[#27342c] sm:text-[21px]">
                            {item.name}
                          </h2>
                          <p className="mt-2 text-[13px] text-[#68716b]">
                            Birim fiyat: {formatPrice(unitPrice)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="flex h-10 w-10 shrink-0 items-center justify-center text-[#7a817b] transition-colors hover:bg-[#f0efeb] hover:text-[#27342c]"
                          aria-label={`${item.name} ürününü sepetten çıkar`}
                          title="Ürünü kaldır"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-end justify-between gap-4">
                        <div className="inline-flex h-10 items-center border border-[#d8ddd8]">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="flex h-9 w-9 items-center justify-center text-[#59625b] transition-colors hover:bg-[#eef0ec]"
                            aria-label={`${item.name} adedini azalt`}
                          >
                            <MinusIcon className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-9 text-center text-[13px] font-medium tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="flex h-9 w-9 items-center justify-center text-[#59625b] transition-colors hover:bg-[#eef0ec]"
                            aria-label={`${item.name} adedini artır`}
                          >
                            <PlusIcon className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="text-[18px] font-semibold tabular-nums text-[#202522]">
                          {formatPrice(unitPrice * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>

            <aside className="h-fit border border-[#e0e2dc] bg-white p-6 sm:p-7 lg:sticky lg:top-28">
              <h2 className="text-[17px] font-medium text-[#27342c]">
                Sipariş özeti
              </h2>
              <div className="mt-6 flex items-center justify-between border-t border-[#e8e9e4] pt-5 text-[13px] text-[#68716b]">
                <span>Ürünler ({itemCount})</span>
                <span className="font-medium tabular-nums text-[#27342c]">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-[#e8e9e4] pt-5">
                <span className="text-[14px] font-medium text-[#27342c]">
                  Ara toplam
                </span>
                <span className="text-[21px] font-semibold tabular-nums text-[#202522]">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="mt-4 text-[11px] leading-5 text-[#7a817b]">
                Taşıma ve teslimat ayrıntıları sipariş onayı sırasında netleştirilir.
              </p>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 flex min-h-12 w-full items-center justify-center gap-2 bg-[#29483c] px-4 text-center text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#203b31]"
              >
                WhatsApp ile sipariş ver
                <ArrowUpRightIcon className="h-4 w-4 shrink-0" />
              </a>
              <Link
                href="/urunler"
                className="mt-5 block text-center text-[11px] font-medium uppercase tracking-[0.12em] text-[#68716b] underline decoration-[#c4cbc5] underline-offset-4 transition-colors hover:text-[#29483c]"
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