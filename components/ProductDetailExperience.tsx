"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowDownLeftIcon,
  AdjustmentsVerticalIcon,
  ShieldCheckIcon,
  BuildingOffice2Icon,
  ShoppingCartIcon,
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
  const [isAddedToastVisible, setIsAddedToastVisible] = useState(false);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [reviewName, setReviewName] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [isSendingReview, setIsSendingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const { addToCart } = useCart();
const whatsappMessage = `Merhaba, ${product.name} hakkında bir sorum var. Ürün ID: ${product.id}`;

// ✅ EN İYİ ve EN GÜVENİLİR YÖNTEM (2026 itibarıyla önerilen)
const whatsappHref = `https://wa.me/905065440466?text=${encodeURIComponent(whatsappMessage)}`;
  const isBackendProduct = useMemo(
    () => /^[a-f0-9]{24}$/i.test(product.id),
    [product.id],
  );

  useEffect(() => {
    const fetchReviews = async () => {
      if (!isBackendProduct) {
        setIsLoadingReviews(false);
        return;
      }

      setIsLoadingReviews(true);
      setReviewError("");

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/products/${product.id}/reviews`,
          { cache: "no-store" },
        );
        const data = (await response.json()) as ReviewItem[] & {
          message?: string;
        };

        if (!response.ok) {
          throw new Error(
            (data as { message?: string }).message || "Yorumlar yüklenemedi.",
          );
        }

        setReviews(Array.isArray(data) ? data : []);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Yorumlar yüklenirken hata oluştu.";
        setReviewError(message);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [isBackendProduct, product.id]);

  const handleAddToCart = () => {
    addToCart(product);
    setIsAddedToastVisible(true);
    setTimeout(() => {
      setIsAddedToastVisible(false);
    }, 2600);
  };

  const handleReviewSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isBackendProduct) {
      setReviewError("Bu ürün için yorum gönderimi şu an kapalı.");
      return;
    }

    setReviewError("");
    setReviewSuccess("");

    if (!reviewName.trim() || !reviewComment.trim()) {
      setReviewError("Ad soyad ve yorum alanları zorunludur.");
      return;
    }

    setIsSendingReview(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/products/${product.id}/reviews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName: reviewName,
            comment: reviewComment,
          }),
        },
      );

      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(data.message || "Yorum gönderilemedi.");
      }

      setReviewName("");
      setReviewComment("");
      setReviewSuccess(data.message || "Yorumunuz alındı.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Yorum gönderilirken hata oluştu.";
      setReviewError(message);
    } finally {
      setIsSendingReview(false);
    }
  };
  return (
    <section className="relative px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto flex w-full max-w-360 flex-col gap-10 lg:gap-14">
        <article className="overflow-hidden rounded-[32px] border border-slate-200 bg-white p-4 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-5 lg:p-6">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch">
            <div className="relative min-h-90 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 lg:col-span-7 lg:min-h-[560px]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 62vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-900/25 via-transparent to-transparent" />
            </div>

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

                <div>
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

                <div className="mt-auto grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-slate-50 shadow-[0_14px_34px_rgba(37,99,235,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700"
                  >
                    <ShoppingCartIcon className="h-5 w-5" />
                    Sepete Ekle
                  </button>

                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1ebe5d]"
                  >
                    <QuestionMarkCircleIcon className="h-5 w-5 text-white" />
                    Soru Sor
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </article>

        <section
          id="urun-detayli-bilgi"
          className="overflow-hidden rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-10 lg:p-12"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-4">
              <span className="h-0.5 w-8 rounded-full bg-blue-600/60" />
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-700">
                Detaylı Bilgi
              </p>
            </div>

            <h3 className="mt-5 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              {product.name}{" "}
              <span className="font-medium text-slate-500">Teknik Detayı</span>
            </h3>

            <p className="mt-6 max-w-4xl text-base leading-relaxed text-slate-600 sm:text-lg sm:leading-loose">
              {product.detailDescription}
            </p>
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8">
          <h3 className="text-2xl font-black text-slate-900">Ürün Yorumları</h3>
          <p className="mt-2 text-sm text-slate-500">
            Onaylanmış yorumlar aşağıda listelenir. Siz de yorum
            gönderebilirsiniz.
          </p>

          {reviewError && (
            <p className="mt-4 text-sm text-rose-300">{reviewError}</p>
          )}
          {reviewSuccess && (
            <p className="mt-4 text-sm text-emerald-600">{reviewSuccess}</p>
          )}

          <div className="mt-4 space-y-3">
            {isLoadingReviews ? (
              <p className="text-sm text-slate-500">Yorumlar yükleniyor...</p>
            ) : reviews.length === 0 ? (
              <p className="text-sm text-slate-500">
                Henüz onaylı yorum bulunmuyor.
              </p>
            ) : (
              reviews.map((review) => (
                <article
                  key={review._id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="text-sm font-semibold text-slate-900">
                    {review.customerName}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    {review.comment}
                  </p>
                </article>
              ))
            )}
          </div>

          <form
            onSubmit={handleReviewSubmit}
            className="mt-6 grid gap-3 sm:grid-cols-2"
          >
            <input
              type="text"
              value={reviewName}
              onChange={(event) => setReviewName(event.target.value)}
              placeholder="Ad Soyad"
              className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition-colors focus:border-blue-400"
            />
            <textarea
              value={reviewComment}
              onChange={(event) => setReviewComment(event.target.value)}
              placeholder="Yorumunuz"
              rows={4}
              className="sm:col-span-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-blue-400"
            />
            <button
              type="submit"
              disabled={isSendingReview}
              className="sm:col-span-2 h-11 rounded-xl bg-blue-600 px-6 text-sm font-bold uppercase tracking-[0.14em] text-slate-50 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSendingReview ? "Gönderiliyor..." : "Yorum Gönder"}
            </button>
          </form>
        </section>
      </div>

      {isAddedToastVisible && (
        <div className="fixed inset-x-0 top-5 z-60 flex justify-center px-4 pointer-events-none">
          <div className="inline-flex min-w-[320px] max-w-md items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-5 py-4 text-emerald-800 shadow-[0_18px_44px_rgba(16,185,129,0.16)]">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 ring-2 ring-emerald-100">
              <CheckCircleIcon className="h-6 w-6 text-emerald-600" />
            </span>
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.08em] text-emerald-700">
                Başarılı
              </p>
              <p className="text-sm font-semibold text-slate-900">
                Ürün sepete eklendi.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
