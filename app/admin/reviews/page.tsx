"use client";

import { useCallback, useEffect, useState } from "react";
import { useMemo } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

type ReviewRow = {
  _id: string;
  customerName: string;
  productName: string;
  comment: string;
  rating: number;
  approved: boolean;
  createdAt?: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminReviewsPage() {
  const { token } = useAuth();
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [approvalFilter, setApprovalFilter] = useState<
    "all" | "approved" | "pending"
  >("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const filteredReviews = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase("tr-TR");

    return reviews
      .filter((review) => {
        if (approvalFilter === "approved" && !review.approved) {
          return false;
        }

        if (approvalFilter === "pending" && review.approved) {
          return false;
        }

        if (!query) {
          return true;
        }

        return `${review.customerName} ${review.productName} ${review.comment}`
          .toLocaleLowerCase("tr-TR")
          .includes(query);
      })
      .sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return sortOrder === "newest" ? bTime - aTime : aTime - bTime;
      });
  }, [reviews, searchQuery, approvalFilter, sortOrder]);

  const fetchReviews = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/reviews`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = (await response.json()) as ReviewRow[] & {
        message?: string;
      };
      if (!response.ok) {
        throw new Error(
          (data as { message?: string }).message || "Yorumlar getirilemedi.",
        );
      }

      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Yorumlar yüklenirken hata oluştu.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const toggleApproval = async (id: string) => {
    if (!token) return;

    setErrorMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/reviews/${id}/toggle`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = (await response.json()) as {
        message?: string;
        review?: ReviewRow;
      };
      if (!response.ok || !data.review) {
        throw new Error(data.message || "Yorum durumu güncellenemedi.");
      }

      setReviews((prev) =>
        prev.map((item) =>
          item._id === data.review?._id ? (data.review as ReviewRow) : item,
        ),
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Yorum güncellenirken hata oluştu.";
      setErrorMessage(message);
    }
  };

  return (
    <section className="flex flex-col gap-6">
      {/* Sayfa Başlığı */}
      <header className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Yorum Moderasyonu</h2>
        <p className="mt-1 text-sm text-slate-500">
          Müşterilerden gelen ürün yorumlarını inceleyin, onaylayın veya
          yayından kaldırın.
        </p>
      </header>

      {/* Filtreleme Paneli */}
      <div className="flex flex-col sm:flex-row gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Müşteri, ürün veya içerik ara..."
          className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
        />
        <select
          value={approvalFilter}
          onChange={(event) =>
            setApprovalFilter(
              event.target.value as "all" | "approved" | "pending",
            )
          }
          className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors min-w-[160px]"
        >
          <option value="all">Tüm Yorumlar</option>
          <option value="approved">Sadece Onaylılar</option>
          <option value="pending">Onay Bekleyenler</option>
        </select>
        <select
          value={sortOrder}
          onChange={(event) =>
            setSortOrder(event.target.value as "newest" | "oldest")
          }
          className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors min-w-[140px]"
        >
          <option value="newest">En Yeni İlk</option>
          <option value="oldest">En Eski İlk</option>
        </select>
      </div>

      {errorMessage && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700">
          {errorMessage}
        </div>
      )}

      {/* Yorum Listesi */}
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-sm font-medium text-slate-500 shadow-sm">
            Yorumlar yükleniyor...
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-sm font-medium text-slate-500 shadow-sm">
            Kriterlere uygun yorum bulunamadı.
          </div>
        ) : (
          filteredReviews.map((review) => (
            <article
              key={review._id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      {review.customerName}
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="text-sm font-medium text-indigo-600">
                      {review.productName}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "text-amber-400" : "text-slate-200"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-xs font-semibold text-slate-500">
                      {review.rating}/5
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-slate-700 italic">
                    &quot;{review.comment}&quot;
                  </p>

                  <p className="mt-3 text-xs font-medium text-slate-400">
                    {review.createdAt
                      ? new Date(review.createdAt).toLocaleString("tr-TR")
                      : "-"}
                  </p>
                </div>

                <div className="flex items-center sm:flex-col sm:items-end gap-3">
                  <button
                    type="button"
                    onClick={() => toggleApproval(review._id)}
                    className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                      review.approved
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : "bg-rose-100 text-rose-700 hover:bg-rose-200"
                    }`}
                  >
                    {review.approved ? "YAYINDA" : "ONAY BEKLİYOR"}
                  </button>

                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter hidden sm:block">
                    {review.approved
                      ? "Gizlemek için tıkla"
                      : "Yayınlamak için tıkla"}
                  </span>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
