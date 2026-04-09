"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  ArrowDownLeftIcon,
  AdjustmentsVerticalIcon,
  ShieldCheckIcon,
  BuildingOffice2Icon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import Breadcrumb from "@/components/Breadcrumb";
import type { Product } from "@/lib/products";

const featureIcons = [
  ArrowDownLeftIcon,
  AdjustmentsVerticalIcon,
  ShieldCheckIcon,
  BuildingOffice2Icon,
];

type ProductDetailExperienceProps = {
  product: Product;
};

export default function ProductDetailExperience({
  product,
}: ProductDetailExperienceProps) {
  const router = useRouter();

  const whatsappMessage = `Merhaba, ${product.name} hakkında bir sorum var.`;
  const whatsappHref = `https://wa.me/905079586868?text=${encodeURIComponent(whatsappMessage)}`;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const displayPrice = product.discountPrice ?? product.price;
  const features = product.features || [
    "Yüksek dayanım sunan güçlendirilmiş şasi yapısı",
    "Uzun ömürlü kullanım için kaliteli malzeme seçimi",
    "Profesyonel taşımacılığa uygun dengeli platform mimarisi",
    "Ankarom satış sonrası destek ekibiyle güvenli operasyon",
  ];

  return (
    <>
      {/* Navigation Breadcrumb - DÜZELTİLDİ: mx-full yerine mx-auto eklendi ve w-full ile desteklendi */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="mx-auto w-full max-w-[1440px] px-6 py-4">
          <Breadcrumb
            items={[
              { label: "Ana Sayfa", href: "/" },
              { label: "Ürünler", href: "/urunler" },
              { label: product.name },
              
            ]}
          />
        </div>
      </div>

      <section className="relative px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Ürün Ana Konteyneri - DÜZELTİLDİ: max-w-6xl yerine breadcrumb ile aynı olan max-w-[1440px] yapıldı */}
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 lg:gap-10">
          
          {/* --- ÜRÜN ANA KARTI --- */}
          <article className="w-full overflow-hidden rounded-[32px] border border-slate-200 bg-white p-4 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-5 lg:p-6">
            

            <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch">
              {/* Ürün Görseli */}
              <div className="relative min-h-96 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 lg:col-span-7 lg:min-h-[560px]">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <svg
                      className="h-32 w-32 text-slate-300"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M19 7h-3V6a4 4 0 00-8 0v1H5a2 2 0 00-2 2v7a2 2 0 002 2h1.1a3 3 0 005.8 0h4.2a3 3 0 005.8 0H21a2 2 0 002-2V9a2 2 0 00-2-2zM10 6a2 2 0 014 0v1h-4V6zm-2 12a1 1 0 11-2 0 1 1 0 012 0zm10 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/25 via-transparent to-transparent" />
              </div>

              {/* Ürün Bilgileri Yan Panel */}
              <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-5 lg:col-span-5 lg:p-6">
                <div className="flex h-full flex-col gap-6">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                      Kurumsal Ürün Serisi
                    </p>
                    <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 sm:text-4xl">
                      {product.name}
                    </h2>
                  </div>

                  {/* Kapasite Bilgisi */}
                  {product.capacity && (
                    <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
                        Taşıma Kapasitesi
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {product.capacity}
                      </span>
                    </div>
                  )}

                  {/* Fiyat Bilgisi */}
                  <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-700">
                      Fiyat
                    </p>
                    <p className="mt-1 text-2xl font-extrabold text-slate-900">
                      {formatPrice(displayPrice)}
                    </p>
                    {product.discountPrice && (
                      <p className="mt-2 text-xs font-medium text-slate-600 line-through">
                        Orjinal Fiyat: {formatPrice(product.price)}
                      </p>
                    )}
                    <p className="mt-2 text-xs font-medium text-slate-600">
                      Stok Durumu: {product.stockStatus}
                    </p>
                  </div>

                  {/* Özellikler */}
                  <div className="flex-1">
                    <ul className="space-y-4 pr-1 text-sm text-slate-600">
                      {features.map((feature, index) => {
                        const Icon = featureIcons[index % featureIcons.length];
                        return (
                          <li key={index} className="flex items-center gap-4">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white">
                              <Icon className="h-5 w-5 text-blue-600" />
                            </span>
                            <span className="leading-snug">{feature}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* WhatsApp Butonu */}
                  <div className="mt-auto pt-4">
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 py-4 text-sm font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1ebe5d]"
                    >
                      <QuestionMarkCircleIcon className="h-5 w-5" />
                      Ürün Hakkında Soru Sor
                    </a>
                  </div>
                </div>
              </aside>
            </div>
          </article>

          {/* --- DETAYLI BİLGİ BÖLÜMÜ --- */}
          <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-10 lg:p-12">
            <div className="relative z-10">
              <div className="flex items-center gap-4">
                <span className="h-0.5 w-8 rounded-full bg-blue-600/60" />
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-700">
                  Teknik Detaylar
                </p>
              </div>

              <h3 className="mt-5 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                {product.name}{" "}
                <span className="font-medium text-slate-500">Kullanım Deneyimi</span>
              </h3>

              <p className="mt-6 max-w-4xl text-base leading-relaxed text-slate-600 sm:text-lg sm:leading-loose">
                {product.description}
              </p>

              {product.deliveryInfo && (
                <div className="mt-8 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
                  <p className="text-sm font-semibold text-green-900">
                    ✓ {product.deliveryInfo}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </section>
    </>
  );
}