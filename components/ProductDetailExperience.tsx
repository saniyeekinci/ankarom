"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  ArrowDownLeftIcon,
  AdjustmentsVerticalIcon,
  ShieldCheckIcon,
  BuildingOffice2Icon,
  QuestionMarkCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
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
  product: Product; // Tipinizde 'images?: string[]' olduğunu varsayıyoruz
};

export default function ProductDetailExperience({
  product,
}: ProductDetailExperienceProps) {
  const router = useRouter();

  // Resim galerisi için state (Hangi resimde olduğumuzu tutar)
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const whatsappMessage = `Merhaba, ${product.name} hakkında bir sorum var.`;
  const whatsappHref = `https://wa.me/905079586868?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const displayPrice = product.discountPrice ?? product.price;
  // Eğer ürünün kendi features dizisi varsa ve içi doluysa onu kullan, yoksa varsayılanları göster.
  const features = product.features && product.features.length > 0 
    ? product.features 
    : [
        "Yüksek dayanım sunan güçlendirilmiş şasi yapısı",
        "Uzun ömürlü kullanım için kaliteli malzeme seçimi",
        "Profesyonel taşımacılığa uygun dengeli platform mimarisi",
        "Ankarom satış sonrası destek ekibiyle güvenli operasyon",
      ];

  // Eğer product.images dizisi varsa onu, yoksa product.imageUrl'i dizi yap, o da yoksa boş dizi.
  const images = product.images?.length
    ? product.images
    : product.imageUrl
    ? [product.imageUrl]
    : [];

  // Önceki Resim Fonksiyonu
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Sonraki Resim Fonksiyonu
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <>
      {/* Navigation Breadcrumb */}
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
        {/* Ürün Ana Konteyneri */}
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 lg:gap-10">
          
          {/* --- ÜRÜN ANA KARTI --- */}
          <article className="w-full overflow-hidden rounded-[32px] border border-slate-200 bg-white p-4 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-5 lg:p-6">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch">
              
              {/* Ürün Görseli ve Slider */}
              <div className="relative min-h-96 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 lg:col-span-7 lg:min-h-[560px]">
                {images.length > 0 ? (
                  <>
                    <img
                      src={images[currentImageIndex]}
                      alt={`${product.name} - Görsel ${currentImageIndex + 1}`}
                      className="h-full w-full object-cover transition-opacity duration-300"
                    />

                    {/* Sağ/Sol Okları (Sadece 1'den fazla resim varsa göster) */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-slate-800 shadow-lg backdrop-blur transition-all hover:bg-white hover:scale-105"
                          aria-label="Önceki Görsel"
                        >
                          <ChevronLeftIcon className="h-6 w-6" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-slate-800 shadow-lg backdrop-blur transition-all hover:bg-white hover:scale-105"
                          aria-label="Sonraki Görsel"
                        >
                          <ChevronRightIcon className="h-6 w-6" />
                        </button>

                        {/* Alt Nokta (Dot) Göstergeleri */}
                        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2 z-10">
                          {images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`h-2.5 rounded-full transition-all ${
                                currentImageIndex === index
                                  ? "w-8 bg-blue-600"
                                  : "w-2.5 bg-white/80 hover:bg-white"
                              }`}
                              aria-label={`Görsel ${index + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  // Resim yoksa gösterilecek placeholder
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
                
                {/* Alt gradient gölgesi (Noktaların net görünmesi için z-index'ten kaçındık) */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60" />
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
        </div>
      </section>
    </>
  );
}