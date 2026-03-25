"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type DashboardResponse = {
  totalRevenue: number;
  totalSales: number;
  totalUsers: number;
  lowStockProducts: number;
  monthlySales: Array<{
    month: string;
    revenue: number;
    salesCount: number;
  }>;
  recentProducts: Array<{
    _id: string;
    name: string;
    category?: string;
    price: number;
    stock: number;
  }>;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!token) {
        return;
      }

      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = (await response.json()) as DashboardResponse & { message?: string };

        if (!response.ok) {
          throw new Error(data.message || "Dashboard verileri alınamadı.");
        }

        setStats(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu.";
        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, [token]);

  const cards = useMemo(
    () => [
      {
        key: "revenue",
        title: "Toplam Gelir",
        value: formatCurrency(stats?.totalRevenue || 0),
        accent: "text-emerald-300",
        bg: "from-emerald-500/20 to-emerald-500/5",
      },
      {
        key: "sales",
        title: "Toplam Satış",
        value: String(stats?.totalSales || 0),
        accent: "text-cyan-300",
        bg: "from-cyan-500/20 to-cyan-500/5",
      },
      {
        key: "users",
        title: "Kayıtlı Kullanıcı",
        value: String(stats?.totalUsers || 0),
        accent: "text-indigo-300",
        bg: "from-indigo-500/20 to-indigo-500/5",
      },
      {
        key: "stock",
        title: "Kritik Stok (<10)",
        value: String(stats?.lowStockProducts || 0),
        accent: "text-rose-300",
        bg: "from-rose-500/20 to-rose-500/5",
      },
    ],
    [stats],
  );

  return (
    <div className="flex flex-col gap-6 space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article
            key={card.key}
            className={`rounded-2xl border border-white/10 bg-linear-to-br ${card.bg} p-5 shadow-[0_16px_40px_rgba(2,6,23,0.45)]`}
          >
            <p className="text-xs uppercase tracking-[0.15em] text-slate-400">{card.title}</p>
            <p className={`mt-3 text-2xl font-black ${card.accent}`}>{card.value}</p>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-white/10 bg-slate-900/75 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-2xl sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl font-bold text-white">Aylık Satış Trendi</h3>
          {isLoading && <span className="text-sm text-slate-400">Yükleniyor...</span>}
        </div>

        {errorMessage && <p className="mt-4 text-sm text-rose-300">{errorMessage}</p>}

        <div className="mt-5 h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats?.monthlySales || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  color: "#e2e8f0",
                }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#22d3ee" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-slate-900/75 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-2xl sm:p-6">
        <h3 className="text-xl font-bold text-white">Son Eklenen Ürünler</h3>
        <p className="mt-1 text-sm text-slate-400">Ürün ekleme ekranından kaydedilen son kayıtlar burada listelenir.</p>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Ürün</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Kategori</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Fiyat</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Stok</th>
              </tr>
            </thead>
            <tbody>
              {(stats?.recentProducts?.length || 0) === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 py-4 text-sm text-slate-300">Henüz ürün kaydı yok.</td>
                </tr>
              ) : (
                stats?.recentProducts.map((product) => (
                  <tr key={product._id} className="rounded-xl border border-white/10 bg-white/5">
                    <td className="rounded-l-xl px-3 py-3 text-sm font-semibold text-white">{product.name}</td>
                    <td className="px-3 py-3 text-sm text-slate-300">{product.category || "Genel"}</td>
                    <td className="px-3 py-3 text-sm font-semibold text-yellow-300">{formatCurrency(product.price || 0)}</td>
                    <td className="rounded-r-xl px-3 py-3 text-sm text-slate-200">{product.stock}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
