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
      { key: "revenue", title: "Toplam Gelir", value: formatCurrency(summary?.totalRevenue || 0), accent: "text-emerald-600" },
      { key: "orders", title: "Toplam Sipariş", value: String(summary?.totalOrders || 0), accent: "text-indigo-600" },
      { key: "avg", title: "Ortalama Sepet", value: formatCurrency(summary?.averageOrderValue || 0), accent: "text-blue-600" },
      { key: "campaigns", title: "Aktif Kampanya", value: String(summary?.activeCampaigns || 0), accent: "text-amber-600" },
    ];
  }, [reports]);

  return (
    <section className="flex flex-col gap-6">
      {/* Başlık Kartı */}
      <header className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Raporlar ve Analizler</h2>
        <p className="mt-1 text-sm text-slate-500">Satış performansınız, sipariş durumlarınız ve ürün başarı özetleriniz.</p>
      </header>

      {errorMessage && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700">
          {errorMessage}
        </div>
      )}

      {/* Özet Kartları */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card.key} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{card.title}</p>
            <p className={`mt-2 text-2xl font-bold tracking-tight ${card.accent}`}>
              {isLoading ? "..." : card.value}
            </p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Sipariş Durum Tablosu */}
        <article className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-lg font-bold text-slate-900">Sipariş Durum Dağılımı</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Durum</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Adet</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Tutar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {(reports?.statusBreakdown?.length || 0) === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-sm text-slate-500">Veri bulunamadı.</td>
                  </tr>
                ) : (
                  reports?.statusBreakdown.map((item) => (
                    <tr key={item.status} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{item.status}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{item.count}</td>
                      <td className="px-6 py-4 text-sm font-bold text-indigo-700">{formatCurrency(item.revenue)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </article>

        {/* Top Ürünler Tablosu */}
        <article className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-lg font-bold text-slate-900">En Çok Ciro Üreten Ürünler</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Ürün</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Adet</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Ciro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {(reports?.topProducts?.length || 0) === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-sm text-slate-500">Veri bulunamadı.</td>
                  </tr>
                ) : (
                  reports?.topProducts.map((item, index) => (
                    <tr key={`${item.productName}-${index}`} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{item.productName || "-"}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{item.totalQuantity}</td>
                      <td className="px-6 py-4 text-sm font-bold text-emerald-700">{formatCurrency(item.totalRevenue)}</td>
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