"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

type DiscountRow = {
  _id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  usageLimit: number;
  active: boolean;
  createdAt?: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminDiscountsPage() {
  const { token } = useAuth();
  const [discounts, setDiscounts] = useState<DiscountRow[]>([]);
  const [code, setCode] = useState("");
  const [type, setType] = useState<"percent" | "fixed">("percent");
  const [value, setValue] = useState("0");
  const [usageLimit, setUsageLimit] = useState("50");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "passive">("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const totalActive = useMemo(() => discounts.filter((item) => item.active).length, [discounts]);
  const filteredDiscounts = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase("tr-TR");

    return discounts
      .filter((item) => {
        if (statusFilter === "active" && !item.active) {
          return false;
        }

        if (statusFilter === "passive" && item.active) {
          return false;
        }

        if (!query) {
          return true;
        }

        return `${item.code} ${item.type}`.toLocaleLowerCase("tr-TR").includes(query);
      })
      .sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return sortOrder === "newest" ? bTime - aTime : aTime - bTime;
      });
  }, [discounts, searchQuery, statusFilter, sortOrder]);

  const fetchDiscounts = useCallback(async () => {
    if (!token) {
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/discounts`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = (await response.json()) as DiscountRow[] & { message?: string };
      if (!response.ok) {
        throw new Error((data as { message?: string }).message || "Kuponlar getirilemedi.");
      }

      setDiscounts(Array.isArray(data) ? data : []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Kuponlar yüklenirken hata oluştu.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDiscounts();
  }, [fetchDiscounts]);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!token) {
      return;
    }

    setErrorMessage("");

    const numericValue = Number(value);
    const numericLimit = Number(usageLimit);
    if (!code.trim() || !Number.isFinite(numericValue) || !Number.isFinite(numericLimit)) {
      setErrorMessage("Lütfen geçerli kupon bilgileri girin.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/discounts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code,
          type,
          value: numericValue,
          usageLimit: numericLimit,
        }),
      });

      const data = (await response.json()) as { message?: string; discount?: DiscountRow };
      if (!response.ok || !data.discount) {
        throw new Error(data.message || "Kupon eklenemedi.");
      }

      setDiscounts((prev) => [data.discount as DiscountRow, ...prev]);
      setCode("");
      setType("percent");
      setValue("0");
      setUsageLimit("50");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Kupon eklenirken hata oluştu.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleDiscount = async (id: string) => {
    if (!token) {
      return;
    }

    setErrorMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/discounts/${id}/toggle`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = (await response.json()) as { message?: string; discount?: DiscountRow };
      if (!response.ok || !data.discount) {
        throw new Error(data.message || "Kupon durumu güncellenemedi.");
      }

      setDiscounts((prev) => prev.map((row) => (row._id === data.discount?._id ? (data.discount as DiscountRow) : row)));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Kupon güncelleme sırasında hata oluştu.";
      setErrorMessage(message);
    }
  };

  return (
    <section className="space-y-6 flex flex-col gap-4">
      <div className="rounded-3xl border border-white/10 bg-slate-900/75 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-2xl sm:p-6">
        <h2 className="text-2xl font-black text-white">İndirim Kuponları</h2>
        <p className="mt-1 text-sm text-slate-400">Kupon kodları oluşturun, aktif/pasif yönetin.</p>
      </div>

      {errorMessage && <p className="text-sm text-rose-300">{errorMessage}</p>}

      <div className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Toplam Kupon</p>
          <p className="mt-2 text-2xl font-black text-white">{discounts.length}</p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Aktif Kupon</p>
          <p className="mt-2 text-2xl font-black text-cyan-200">{totalActive}</p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Pasif Kupon</p>
          <p className="mt-2 text-2xl font-black text-rose-200">{discounts.length - totalActive}</p>
        </article>
      </div>

      <form onSubmit={handleCreate} className="grid gap-3 rounded-3xl border border-white/10 bg-slate-900/75 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-2xl md:grid-cols-4">
        <input
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Kupon kodu"
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 outline-none focus:border-cyan-400/70"
        />
        <select
          value={type}
          onChange={(event) => setType(event.target.value as "percent" | "fixed")}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400/70"
        >
          <option value="percent" className="bg-slate-900">Yüzde</option>
          <option value="fixed" className="bg-slate-900">Sabit Tutar</option>
        </select>
        <input
          type="number"
          min="0"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="İndirim değeri"
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 outline-none focus:border-cyan-400/70"
        />
        <input
          type="number"
          min="1"
          value={usageLimit}
          onChange={(event) => setUsageLimit(event.target.value)}
          placeholder="Kullanım limiti"
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 outline-none focus:border-cyan-400/70"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="md:col-span-4 rounded-xl border border-cyan-300/30 bg-cyan-500/10 px-3 py-2.5 text-sm font-semibold text-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Ekleniyor..." : "Kupon Ekle"}
        </button>
      </form>

      <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 md:grid-cols-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Kod veya tip ara"
          className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 outline-none focus:border-cyan-400/70"
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as "all" | "active" | "passive")}
          className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400/70"
        >
          <option value="all" className="bg-slate-900">Tüm Durumlar</option>
          <option value="active" className="bg-slate-900">Sadece Aktif</option>
          <option value="passive" className="bg-slate-900">Sadece Pasif</option>
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

      <div className="overflow-x-auto rounded-3xl border border-white/10 bg-slate-900/75 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-2xl">
        <table className="min-w-full border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Kod</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Tip</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Değer</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Limit</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Tarih</th>
              <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Durum</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-3 py-4 text-sm text-slate-300">Kuponlar yükleniyor...</td>
              </tr>
            ) : filteredDiscounts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-4 text-sm text-slate-300">Filtreye uygun kupon bulunamadı.</td>
              </tr>
            ) : filteredDiscounts.map((item) => (
              <tr key={item._id} className="rounded-xl border border-white/10 bg-white/5">
                <td className="rounded-l-xl px-3 py-3 text-sm font-semibold text-white">{item.code}</td>
                <td className="px-3 py-3 text-sm text-slate-200">{item.type === "percent" ? "Yüzde" : "Sabit"}</td>
                <td className="px-3 py-3 text-sm text-cyan-200">{item.value}</td>
                <td className="px-3 py-3 text-sm text-slate-200">{item.usageLimit}</td>
                <td className="px-3 py-3 text-xs text-slate-400">{item.createdAt ? new Date(item.createdAt).toLocaleDateString("tr-TR") : "-"}</td>
                <td className="rounded-r-xl px-3 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => toggleDiscount(item._id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${item.active ? "border border-emerald-300/30 bg-emerald-500/10 text-emerald-200" : "border border-rose-300/30 bg-rose-500/10 text-rose-200"}`}
                  >
                    {item.active ? "Aktif" : "Pasif"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
