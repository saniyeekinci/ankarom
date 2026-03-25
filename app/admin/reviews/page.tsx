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
  const [approvalFilter, setApprovalFilter] = useState<"all" | "approved" | "pending">("all");
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
    if (!token) {
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/reviews`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = (await response.json()) as ReviewRow[] & { message?: string };
      if (!response.ok) {
        throw new Error((data as { message?: string }).message || "Yorumlar getirilemedi.");
      }

      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Yorumlar yüklenirken hata oluştu.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const toggleApproval = async (id: string) => {
    if (!token) {
      return;
    }

    setErrorMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/reviews/${id}/toggle`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = (await response.json()) as { message?: string; review?: ReviewRow };
      if (!response.ok || !data.review) {
        throw new Error(data.message || "Yorum durumu güncellenemedi.");
      }

      setReviews((prev) => prev.map((item) => (item._id === data.review?._id ? (data.review as ReviewRow) : item)));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Yorum güncellenirken hata oluştu.";
      setErrorMessage(message);
    }
  };

  return (
    <section className="space-y-6 flex flex-col gap-4">
      <div className="rounded-3xl border border-white/10 bg-slate-900/75 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-2xl sm:p-6">
        <h2 className="text-2xl font-black text-white">Yorum Moderasyonu</h2>
        <p className="mt-1 text-sm text-slate-400">Müşteri yorumlarını onaylayın veya pasife alın.</p>
      </div>

      {errorMessage && <p className="text-sm text-rose-300">{errorMessage}</p>}

      <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 md:grid-cols-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Müşteri, ürün veya yorum ara"
          className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 outline-none focus:border-cyan-400/70"
        />
        <select
          value={approvalFilter}
          onChange={(event) => setApprovalFilter(event.target.value as "all" | "approved" | "pending")}
          className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400/70"
        >
          <option value="all" className="bg-slate-900">Tüm Yorumlar</option>
          <option value="approved" className="bg-slate-900">Onaylı</option>
          <option value="pending" className="bg-slate-900">Beklemede</option>
        </select>
        <select
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value as "newest" | "oldest")}
          className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400/70"
        >
          <option value="newest" className="bg-slate-900">En Yeni</option>
          <option value="oldest" className="bg-slate-900">En Eski</option>
        </select>
      </div>

      <div className="space-y-3 flex flex-col gap-4">
        {isLoading ? (
          <p className="text-sm text-slate-300">Yorumlar yükleniyor...</p>
        ) : filteredReviews.length === 0 ? (
          <p className="text-sm text-slate-300">Filtreye uygun yorum bulunamadı.</p>
        ) : filteredReviews.map((review) => (
          <article key={review._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">{review.customerName} • {review.productName}</p>
                <p className="mt-1 text-xs text-amber-300">Puan: {review.rating}/5</p>
                <p className="mt-2 text-sm text-slate-300">{review.comment}</p>
                <p className="mt-2 text-xs text-slate-500">{review.createdAt ? new Date(review.createdAt).toLocaleString("tr-TR") : "-"}</p>
              </div>
              <button
                type="button"
                onClick={() => toggleApproval(review._id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${review.approved ? "border border-emerald-300/30 bg-emerald-500/10 text-emerald-200" : "border border-rose-300/30 bg-rose-500/10 text-rose-200"}`}
              >
                {review.approved ? "Onaylı" : "Beklemede"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
