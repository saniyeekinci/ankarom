"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type ReportsResponse = {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    deliveredOrders: number;
    canceledOrders: number;
    totalUsers: number;
    totalProducts: number;
    activeCampaigns: number;
    averageOrderValue: number;
  };
  topProducts: Array<{
    productName: string;
    totalQuantity: number;
    totalRevenue: number;
  }>;
  statusBreakdown: Array<{
    status: string;
    count: number;
    revenue: number;
  }>;
  monthlyRevenue: Array<{
    year: number;
    month: number;
    revenue: number;
    orderCount: number;
  }>;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);

export default function AdminReportsPage() {
  const { token } = useAuth();
  const [reports, setReports] = useState<ReportsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      if (!token) return;

      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/reports`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = (await response.json()) as ReportsResponse & { message?: string };

        if (!response.ok) {
          throw new Error(data.message || "Rapor verileri alınamadı.");
        }

        setReports(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Raporlar yüklenirken hata oluştu.";
        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [token]);

  const cards = useMemo(() => {
    const summary = reports?.summary;
    return [
      { key: "revenue", title: "Toplam Gelir", value: formatCurrency(summary?.totalRevenue || 0), accent: "text-emerald-300" },
      { key: "orders", title: "Toplam Sipariş", value: String(summary?.totalOrders || 0), accent: "text-cyan-300" },
      { key: "avg", title: "Ortalama Sepet", value: formatCurrency(summary?.averageOrderValue || 0), accent: "text-indigo-300" },
      { key: "campaigns", title: "Aktif Kampanya", value: String(summary?.activeCampaigns || 0), accent: "text-amber-300" },
    ];
  }, [reports]);

  return (
    <section className="space-y-6 flex flex-col gap-4" >
      <div className="rounded-3xl border border-white/10 bg-slate-900/75 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-2xl sm:p-6">
        <h2 className="text-2xl font-black text-white">Raporlar</h2>
        <p className="mt-1 text-sm text-slate-400">Satış, sipariş ve ürün performans özetleri.</p>
      </div>

      {errorMessage && <p className="text-sm text-rose-300">{errorMessage}</p>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card.key} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">{card.title}</p>
            <p className={`mt-2 text-2xl font-black ${card.accent}`}>{isLoading ? "..." : card.value}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-3xl border border-white/10 bg-slate-900/75 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-2xl sm:p-6">
          <h3 className="text-lg font-bold text-white">Sipariş Durum Dağılımı</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Durum</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Adet</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Tutar</th>
                </tr>
              </thead>
              <tbody>
                {(reports?.statusBreakdown?.length || 0) === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-3 py-4 text-sm text-slate-300">Veri bulunamadı.</td>
                  </tr>
                ) : (
                  reports?.statusBreakdown.map((item) => (
                    <tr key={item.status} className="rounded-xl border border-white/10 bg-white/5">
                      <td className="rounded-l-xl px-3 py-3 text-sm text-white">{item.status}</td>
                      <td className="px-3 py-3 text-sm text-slate-200">{item.count}</td>
                      <td className="rounded-r-xl px-3 py-3 text-sm text-yellow-300">{formatCurrency(item.revenue)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-3xl border border-white/10 bg-slate-900/75 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-2xl sm:p-6">
          <h3 className="text-lg font-bold text-white">En Çok Ciro Üreten Ürünler</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Ürün</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Adet</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Ciro</th>
                </tr>
              </thead>
              <tbody>
                {(reports?.topProducts?.length || 0) === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-3 py-4 text-sm text-slate-300">Veri bulunamadı.</td>
                  </tr>
                ) : (
                  reports?.topProducts.map((item, index) => (
                    <tr key={`${item.productName}-${index}`} className="rounded-xl border border-white/10 bg-white/5">
                      <td className="rounded-l-xl px-3 py-3 text-sm text-white">{item.productName || "-"}</td>
                      <td className="px-3 py-3 text-sm text-slate-200">{item.totalQuantity}</td>
                      <td className="rounded-r-xl px-3 py-3 text-sm text-yellow-300">{formatCurrency(item.totalRevenue)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  );
}
