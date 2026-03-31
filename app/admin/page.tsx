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
        accent: "text-emerald-600",
      },
      {
        key: "sales",
        title: "Toplam Satış",
        value: String(stats?.totalSales || 0),
        accent: "text-indigo-600",
      },
      {
        key: "users",
        title: "Kayıtlı Kullanıcı",
        value: String(stats?.totalUsers || 0),
        accent: "text-blue-600",
      },
      {
        key: "stock",
        title: "Kritik Stok (<10)",
        value: String(stats?.lowStockProducts || 0),
        accent: "text-rose-600",
      },
    ],
    [stats],
  );

  return (
    <div className="flex flex-col gap-6">
      {/* İstatistik Kartları */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article
            key={card.key}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{card.title}</p>
            <p className={`mt-2 text-3xl font-bold tracking-tight ${card.accent}`}>{card.value}</p>
          </article>
        ))}
      </section>

      {/* Grafik Bölümü */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-slate-900">Aylık Satış Trendi</h3>
          {isLoading && <span className="text-sm font-medium text-slate-400">Veriler yükleniyor...</span>}
        </div>

        {errorMessage && <p className="mt-4 text-sm font-medium text-rose-500">{errorMessage}</p>}

        <div className="mt-6 h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats?.monthlySales || []} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis 
                dataKey="month" 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                dy={10} 
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                dx={-10}
                tickFormatter={(value) => `₺${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#e2e8f0",
                  borderRadius: "8px",
                  color: "#0f172a",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
                }}
                itemStyle={{ color: "#4f46e5", fontWeight: 600 }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                name="Gelir"
                stroke="#4f46e5" 
                strokeWidth={3} 
                dot={{ r: 4, fill: "#4f46e5", strokeWidth: 2, stroke: "#ffffff" }} 
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Tablo Bölümü */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">Son Eklenen Ürünler</h3>
          <p className="mt-1 text-sm text-slate-500">Sisteme kaydedilen en son ürünler aşağıda listelenmektedir.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Ürün</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Kategori</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Fiyat</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Stok</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {(stats?.recentProducts?.length || 0) === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-500">
                    Henüz ürün kaydı bulunmamaktadır.
                  </td>
                </tr>
              ) : (
                stats?.recentProducts.map((product) => (
                  <tr key={product._id} className="transition-colors hover:bg-slate-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                      {product.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                      {product.category || "Genel Kategori"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">
                      {formatCurrency(product.price || 0)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        product.stock < 10 ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {product.stock} Adet
                      </span>
                    </td>
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