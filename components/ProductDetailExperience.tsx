"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  ArrowDownLeftIcon,
  AdjustmentsVerticalIcon,
  ShieldCheckIcon,
  BuildingOffice2Icon,
  QuestionMarkCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import type { TrailerProduct } from "@/lib/trailerProducts";
import { useCart } from "@/components/cart/CartProvider";

const featureIcons = [
  ArrowDownLeftIcon,
  AdjustmentsVerticalIcon,
  ShieldCheckIcon,
  BuildingOffice2Icon,
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type ReviewItem = {
  _id: string;
  customerName: string;
  comment: string;
  rating: number;
  createdAt: string;
};

type ProductDetailExperienceProps = {
  product: TrailerProduct;
};

export default function ProductDetailExperience({
  product,
}: ProductDetailExperienceProps) {
  const router = useRouter();
  // const [isAddedToastVisible, setIsAddedToastVisible] = useState(false);
  // Yorumlar kaldırıldı
  // const [reviews, setReviews] = useState<ReviewItem[]>([]);
  // const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  // const [reviewName, setReviewName] = useState("");
  // const [reviewComment, setReviewComment] = useState("");
  // const [isSendingReview, setIsSendingReview] = useState(false);
  // const [reviewError, setReviewError] = useState("");
  // const [reviewSuccess, setReviewSuccess] = useState("");
  // const { addToCart } = useCart();

  const whatsappMessage = `Merhaba, ${product.name} hakkında bir sorum var.`;
  const whatsappHref = `https://wa.me/905065440466?text=${encodeURIComponent(whatsappMessage)}`;

  const isBackendProduct = useMemo(
    () => /^[a-f0-9]{24}$/i.test(product.id),
    [product.id],
  );

  // Yorumlar kaldırıldı

  // Yorum gönderme kaldırıldı

  return (
    <section className="relative px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-360 flex-col gap-6 lg:gap-10">
        
        

        {/* --- ÜRÜN ANA KARTI --- */}
        <article className="overflow-hidden rounded-[32px] border border-slate-200 bg-white p-4 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-5 lg:p-6">
         {/* --- GERİ DÖN BUTONU --- */}
        <div className="flex items-center justify-end mt-8 mb-8">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Geri Dön
          </button>
        </div>
          <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch">
            {/* Ürün Görseli */}
            
            <div className="relative min-h-90 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 lg:col-span-7 lg:min-h-[560px]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 62vw"
                className="object-cover"
              />
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

                <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-700">
                    Fiyat
                  </p>
                  <p className="mt-1 text-2xl font-extrabold text-slate-900">
                    {product.currentPrice} + KDV
                  </p>
                  <p className="mt-2 text-xs font-medium text-slate-600">
                    Teslim Süresi: 4-6 Hafta (Siparişe Özel Üretim)
                  </p>
                </div>

                <div className="flex-1">
                  <ul className="space-y-4 pr-1 text-sm text-slate-600">
                    {product.features.map((feature, index) => {
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

                <div className="mt-auto pt-4">
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 py-4 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1ebe5d] shadow-md"
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
        <section
          id="urun-detayli-bilgi"
          className="overflow-hidden rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-10 lg:p-12"
        >
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
              {product.detailDescription}
            </p>
          </div>
        </section>

        {/* --- YORUMLAR BÖLÜMÜ KALDIRILDI --- */}
      </div>

      {/* Sepete ekleme bildirimi kaldırıldı */}
    </section>
  );
}