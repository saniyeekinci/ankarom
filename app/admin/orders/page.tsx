"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type AdminOrder = {
  _id: string;
  totalAmount: number;
  status: "Hazırlanıyor" | "Kargolandı" | "Teslim Edildi" | "İptal Edildi";
  createdAt: string;
  user?: {
    name?: string;
    email?: string;
  };
  items: Array<{
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);

const statusClassMap: Record<string, string> = {
  Hazırlanıyor: "border-amber-300/30 bg-amber-500/10 text-amber-200",
  Kargolandı: "border-cyan-300/30 bg-cyan-500/10 text-cyan-200",
  "Teslim Edildi": "border-emerald-300/30 bg-emerald-500/10 text-emerald-200",
  "İptal Edildi": "border-rose-300/30 bg-rose-500/10 text-rose-200",
};

export default function AdminOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;

      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = (await response.json()) as AdminOrder[] & { message?: string };

        if (!response.ok) {
          throw new Error((data as { message?: string }).message || "Siparişler getirilemedi.");
        }

        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Sipariş verisi alınırken hata oluştu.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const totalOrderAmount = useMemo(() => orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0), [orders]);

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-slate-900/75 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-2xl sm:p-6">
        <h2 className="text-2xl font-black text-white">Sipariş Yönetimi</h2>
        <p className="mt-1 text-sm text-slate-400">Tüm kullanıcı siparişlerini tek panelden yönetin.</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Toplam Sipariş</p>
            <p className="mt-2 text-2xl font-black text-white">{orders.length}</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Toplam Tutar</p>
            <p className="mt-2 text-2xl font-black text-yellow-300">{formatCurrency(totalOrderAmount)}</p>
          </article>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-white/10 bg-slate-900/75 p-4 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-2xl sm:p-6">
        {errorMessage && <p className="mb-4 text-sm text-rose-300">{errorMessage}</p>}

        <table className="min-w-full border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Sipariş</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Müşteri</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Ürün Sayısı</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Toplam</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Durum</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-3 py-4 text-sm text-slate-300">Siparişler yükleniyor...</td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-4 text-sm text-slate-300">Kayıtlı sipariş bulunamadı.</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="rounded-xl border border-white/10 bg-white/5">
                  <td className="rounded-l-xl px-3 py-3 text-sm text-white">
                    <p className="font-semibold">#{order._id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString("tr-TR")}</p>
                  </td>
                  <td className="px-3 py-3 text-sm text-slate-200">
                    <p>{order.user?.name || "-"}</p>
                    <p className="text-xs text-slate-400">{order.user?.email || "-"}</p>
                  </td>
                  <td className="px-3 py-3 text-sm text-slate-200">{order.items?.length || 0}</td>
                  <td className="px-3 py-3 text-sm font-semibold text-yellow-300">{formatCurrency(order.totalAmount || 0)}</td>
                  <td className="rounded-r-xl px-3 py-3">
                    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClassMap[order.status] || "border-white/20 bg-white/5 text-white"}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
