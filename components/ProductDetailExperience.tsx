"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowDownLeftIcon, AdjustmentsVerticalIcon, ShieldCheckIcon, BuildingOffice2Icon, ShoppingCartIcon, QuestionMarkCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import type { TrailerProduct } from "@/lib/trailerProducts";
import { useCart } from "@/components/cart/CartProvider";

const featureIcons = [ArrowDownLeftIcon, AdjustmentsVerticalIcon, ShieldCheckIcon, BuildingOffice2Icon];

type ProductDetailExperienceProps = {
  product: TrailerProduct;
};

export default function ProductDetailExperience({ product }: ProductDetailExperienceProps) {
  const [isAddedToastVisible, setIsAddedToastVisible] = useState(false);
  const { addToCart } = useCart();
  const whatsappMessage = `Merhaba, ${product.name} hakkında bir sorum var. Ürün ID: ${product.id}`;
  const whatsappHref = `https://wa.me/905XXXXXXXXX?text=${encodeURIComponent(whatsappMessage)}`;

  const handleAddToCart = () => {
    addToCart(product);
    setIsAddedToastVisible(true);
    setTimeout(() => {
      setIsAddedToastVisible(false);
    }, 2600);
  };
  return (
    <section className="relative px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      {/* Flex ve gap kullanarak iki ana kartın arasını kesin olarak açıyoruz */}
      <div className="mx-auto w-full max-w-360 flex flex-col gap-12 lg:gap-20">
        
        {/* 1. Kısım: Ürün Kartı */}
        <article className="relative overflow-hidden rounded-[34px] border border-white/10 bg-linear-to-br from-[#060b1f] via-[#0a1230] to-[#1a0c2d] p-4 shadow-[0_28px_90px_rgba(2,6,23,0.6)] sm:p-5 lg:p-6">
          <div className="pointer-events-none absolute -left-10 -top-10 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-12 top-16 h-56 w-56 rounded-full bg-fuchsia-500/15 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-20 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/35 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] lg:p-5">
            <div className="grid h-full gap-4 lg:grid-cols-12 lg:gap-5">
              
              {/* Sol Taraf: Görsel */}
              <div className="relative min-h-90 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/35 shadow-[0_24px_70px_rgba(2,6,23,0.55)] lg:col-span-7 lg:min-h-0">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 62vw"
                  className="object-cover saturate-110"
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-tr from-slate-950/80 via-slate-950/20 to-indigo-900/20" />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/85 via-transparent to-transparent" />
                <div className="pointer-events-none absolute -left-8 top-5 h-36 w-80 rotate-6 bg-white/10 blur-2xl" />
                <div className="pointer-events-none absolute bottom-4 left-4 right-4 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 backdrop-blur-md">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200">Cinematic Product Visual</p>
                  <p className="mt-1 text-xs text-slate-300">Blue pickup + low trailer kombinasyonu, yüksek kontrast gece sahnesi.</p>
                </div>
              </div>

              {/* Sağ Taraf: İçerik */}
              <aside className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/8 p-5 shadow-[0_26px_80px_rgba(5,10,30,0.65)] backdrop-blur-2xl lg:col-span-5 lg:p-6">
                <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-emerald-400/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-10 left-0 h-36 w-36 rounded-full bg-indigo-500/20 blur-3xl" />

                <div className="relative z-10 grid h-full content-start gap-y-16">
                  
                  {/* Başlık Grubu */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-300">Automotive Premium Series</p>
                    <h2 className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl">{product.name}</h2>
                  </div>

                  {/* Fiyat Grubu */}
                  <div>
                    <div className="rounded-2xl border border-yellow-300/30 bg-yellow-300/10 px-4 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-yellow-200/90">Fiyat</p>
                      <p className="mt-1 text-2xl font-extrabold text-yellow-300">{product.currentPrice} + KDV</p>
                      <p className="mt-2 text-xs font-medium text-slate-300">Teslim Süresi: 4–6 Hafta (Siparişe Özel Üretim)</p>
                    </div>
                  </div>

                  {/* Özellikler Listesi Grubu - PARLAMA KALDIRILDI */}
                  <div>
                    <ul className="space-y-5 pr-1 text-sm text-slate-200">
                      {product.features.map((feature, index) => {
                        const Icon = featureIcons[index % featureIcons.length];
                        return (
                          <li key={index} className="flex items-center gap-4">
                            {/* İkon Kapsayıcı: Parlamalar kaldırıldı, resimdeki gibi köşeli ve mat yapıldı */}
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                              <Icon className="h-5 w-5 text-slate-300" />
                            </span>
                            {/* Metin */}
                            <span className="leading-snug">{feature}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Butonlar Grubu */}
                  <div className="mt-auto grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-yellow-500 via-amber-500 to-amber-600 px-4 py-3.5 text-sm font-bold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_14px_34px_rgba(245,158,11,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105"
                    >
                      <ShoppingCartIcon className="h-5 w-5" />
                      Satın Al
                    </button>

                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/35 bg-white/5 px-4 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-white/10 hover:-translate-y-0.5"
                    >
                      <QuestionMarkCircleIcon className="h-5 w-5 text-slate-300" />
                      Soru Sor
                    </a>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </article>

        {/* 2. Kısım: Detaylı Bilgi Bölümü */}
        <section
          id="urun-detayli-bilgi"
          className="relative overflow-hidden rounded-4xl border border-white/10 bg-linear-to-b from-slate-900/80 to-[#060b1f]/90 p-8 shadow-[0_30px_100px_rgba(2,6,23,0.8)] backdrop-blur-2xl sm:p-10 lg:p-12"
        >
          {/* Arka plan süslemeleri (Glow efektleri) */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-[80px]" />
          
          {/* Sol taraftaki şık neon vurgu çizgisi */}
          <div className="absolute bottom-0 left-0 top-0 w-1.5 bg-linear-to-b from-cyan-400 via-indigo-500 to-transparent opacity-80" />

          <div className="relative z-10">
            {/* Üst Etiket (Eyebrow) ve Çizgi */}
            <div className="flex items-center gap-4">
              <span className="h-0.5 w-8 rounded-full bg-cyan-400/60" />
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">
                Detaylı Bilgi
              </p>
            </div>
            
            {/* Ana Başlık */}
            <h3 className="mt-5 text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
              {product.name} <span className="font-light text-slate-400">Teknik Detayı</span>
            </h3>
            
            {/* Açıklama Metni */}
            <p className="mt-6 max-w-4xl text-base leading-relaxed text-slate-300 sm:text-lg sm:leading-loose">
              {product.detailDescription}
            </p>
          </div>
        </section>

      </div>

      {isAddedToastVisible && (
        <div className="fixed inset-x-0 top-5 z-60 flex justify-center px-4 pointer-events-none">
          <div className="inline-flex min-w-[320px] max-w-md items-center gap-3 rounded-2xl border border-emerald-300/40 bg-slate-950/95 px-5 py-4 text-emerald-100 shadow-[0_18px_44px_rgba(16,185,129,0.45)] backdrop-blur-2xl">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 ring-2 ring-emerald-300/30">
              <CheckCircleIcon className="h-6 w-6 text-emerald-300" />
            </span>
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.08em] text-emerald-200">Başarılı</p>
              <p className="text-sm font-semibold text-white">Ürün sepete eklendi.</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}