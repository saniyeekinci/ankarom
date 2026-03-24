"use client";

import Image from "next/image";
import Link from "next/link";
import { MinusIcon, PlusIcon, TrashIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/components/cart/CartProvider";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);

export default function CartPage() {
  const { items, itemCount, subtotal, updateQuantity, removeFromCart, clearCart } = useCart();

  return (
    <section className="relative overflow-hidden px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="pointer-events-none absolute -left-20 top-12 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-20 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="flex flex-col gap-12 relative mx-auto w-full max-w-360">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Sepet Yönetimi</p>
            <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">Sepetlerim</h1>
            <p className="mt-2 text-sm text-slate-300">Toplam {itemCount} ürün seçildi.</p>
          </div>
          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Sepeti Temizle
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <article className="flex flex-col gap-2 rounded-3xl border border-white/10 bg-linear-to-b from-slate-900/75 to-slate-950/85 p-8 text-center shadow-[0_20px_60px_rgba(2,6,23,0.55)] backdrop-blur-xl">
            <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300">
              <ShoppingBagIcon className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-bold text-white">Sepetiniz şu an boş</h2>
            <p className="mt-3 text-sm text-slate-400">Ürün listesine dönerek sepetinize ürün ekleyebilirsiniz.</p>
            <Link
              href="/urunler"
              className="mt-6 inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-indigo-500 to-cyan-500 px-5 py-3 text-sm font-bold text-white shadow-[0_10px_26px_rgba(59,130,246,0.35)] transition-all hover:-translate-y-0.5"
            >
              Ürünlere Git
            </Link>
          </article>
        ) : (
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="flex flex-col gap-4 lg:col-span-8 space-y-4">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-linear-to-b from-slate-900/75 to-slate-950/85 p-4 shadow-[0_18px_50px_rgba(2,6,23,0.5)] backdrop-blur-xl sm:flex-row"
                >
                  <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-white/10 sm:h-32 sm:w-52">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 220px" />
                  </div>

                  <div className="flex flex-1 flex-col justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">{item.deliveryText}</p>
                      <h2 className="mt-1 text-lg font-bold text-white">{item.name}</h2>
                      <p className="mt-2 text-xl font-extrabold text-yellow-300">{item.currentPrice}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="inline-flex items-center rounded-xl border border-white/20 bg-white/5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 text-slate-300 transition-colors hover:text-white"
                          aria-label="Adet azalt"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="min-w-10 text-center text-sm font-bold text-white">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 text-slate-300 transition-colors hover:text-white"
                          aria-label="Adet artır"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-300/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-200 transition-colors hover:bg-rose-500/20"
                      >
                        <TrashIcon className="h-4 w-4" />
                        Kaldır
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="flex flex-col gap-5 lg:col-span-4 rounded-3xl border border-white/10 bg-linear-to-b from-slate-900/80 to-slate-950/85 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Sipariş Özeti</p>
              <h3 className="mt-2 text-2xl font-black text-white">Toplam</h3>

              <div className="mt-6 space-y-3 text-sm text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Ürün Adedi</span>
                  <span className="font-semibold text-white">{itemCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Ara Toplam</span>
                  <span className="font-semibold text-white">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Teslimat</span>
                  <span className="font-semibold text-emerald-300">Ücretsiz</span>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-yellow-300/30 bg-yellow-300/10 px-4 py-3">
                <p className="text-xs text-yellow-200">Genel Toplam</p>
                <p className="mt-1 text-2xl font-black text-yellow-300">{formatCurrency(subtotal)}</p>
              </div>

              <button
                type="button"
                className="mt-6 w-full rounded-2xl bg-linear-to-r from-emerald-500 to-green-500 px-4 py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(16,185,129,0.35)] transition-all hover:-translate-y-0.5"
              >
                Siparişi Tamamla
              </button>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
