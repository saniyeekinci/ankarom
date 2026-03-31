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
    if (!token) return;

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

    if (!token) return;

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
          code: code.toUpperCase(),
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
    if (!token) return;

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
    <section className="flex flex-col gap-6">
      {/* Sayfa Başlığı */}
      <header className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">İndirim Kuponları</h2>
        <p className="mt-1 text-sm text-slate-500">Pazarlama çalışmaları için indirim kodları oluşturun ve yönetin.</p>
      </header>

      {/* İstatistik Özetleri */}
      <div className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Toplam Tanımlı Kupon</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{discounts.length}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Aktif Kuponlar</p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">{totalActive}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pasif / Süresi Dolan</p>
          <p className="mt-2 text-2xl font-bold text-rose-600">{discounts.length - totalActive}</p>
        </article>
      </div>

      {/* Yeni Kupon Oluşturma Formu */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-slate-900">Yeni Kupon Oluştur</h3>
        <form onSubmit={handleCreate} className="grid gap-4 md:grid-cols-4 items-end">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Kupon Kodu</label>
            <input
              value={code}
              onChange={(event) => setCode(event.target.value.toUpperCase())}
              placeholder="Örn: YAZ2024"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">İndirim Tipi</label>
            <select
              value={type}
              onChange={(event) => setType(event.target.value as "percent" | "fixed")}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
            >
              <option value="percent">Yüzde (%)</option>
              <option value="fixed">Sabit Tutar (₺)</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Değer</label>
            <input
              type="number"
              min="0"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="0"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Kullanım Limiti</label>
            <input
              type="number"
              min="1"
              value={usageLimit}
              onChange={(event) => setUsageLimit(event.target.value)}
              placeholder="50"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="md:col-span-4 mt-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSubmitting ? "Kupon Ekleniyor..." : "İndirim Kuponu Oluştur"}
          </button>
        </form>
        {errorMessage && <p className="mt-4 text-sm font-medium text-rose-600">{errorMessage}</p>}
      </div>

      {/* Liste ve Filtreler */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="grid gap-4 p-4 border-b border-slate-100 md:grid-cols-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Kod veya tip ara..."
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as "all" | "active" | "passive")}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          >
            <option value="all">Durum (Hepsi)</option>
            <option value="active">Sadece Aktifler</option>
            <option value="passive">Sadece Pasifler</option>
          </select>
          <select
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value as "newest" | "oldest")}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          >
            <option value="newest">En Yeni İlk</option>
            <option value="oldest">En Eski İlk</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Kupon Kodu</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Tip</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Değer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Limit</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Oluşturma</th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">Yükleniyor...</td></tr>
              ) : filteredDiscounts.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">Kupon bulunamadı.</td></tr>
              ) : (
                filteredDiscounts.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-slate-900 tracking-wider">{item.code}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{item.type === "percent" ? "Yüzde (%)" : "Sabit Tutar"}</td>
                    <td className="px-6 py-4 text-sm font-bold text-indigo-600">
                      {item.type === "percent" ? `%${item.value}` : `₺${item.value}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{item.usageLimit} Kullanım</td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString("tr-TR") : "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => toggleDiscount(item._id)}
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold transition-all ${
                          item.active 
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" 
                            : "bg-rose-100 text-rose-700 hover:bg-rose-200"
                        }`}
                      >
                        {item.active ? "AKTİF" : "PASİF"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}