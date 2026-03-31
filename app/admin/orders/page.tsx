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
  Hazırlanıyor: "bg-amber-100 text-amber-700 border-amber-200",
  Kargolandı: "bg-blue-100 text-blue-700 border-blue-200",
  "Teslim Edildi": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "İptal Edildi": "bg-rose-100 text-rose-700 border-rose-200",
};

export default function AdminOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | AdminOrder["status"]>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

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
  
  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase("tr-TR");

    return orders
      .filter((order) => {
        if (statusFilter !== "all" && order.status !== statusFilter) {
          return false;
        }

        if (!query) {
          return true;
        }

        const orderCode = order._id.slice(-6).toUpperCase();
        return `${orderCode} ${order.user?.name || ""} ${order.user?.email || ""}`.toLocaleLowerCase("tr-TR").includes(query);
      })
      .sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return sortOrder === "newest" ? bTime - aTime : aTime - bTime;
      });
  }, [orders, searchQuery, statusFilter, sortOrder]);

  return (
    <section className="flex flex-col gap-6">
      {/* Üst Başlık ve Özet Kartları */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Sipariş Yönetimi</h2>
        <p className="mt-1 text-sm text-slate-500">Tüm kullanıcı siparişlerini tek panelden takip edin ve yönetin.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <article className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Toplam Sipariş Adedi</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{orders.length} Adet</p>
          </article>
          <article className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Toplam Ciro</p>
            <p className="mt-1 text-2xl font-bold text-indigo-600">{formatCurrency(totalOrderAmount)}</p>
          </article>
        </div>
      </div>

      {/* Filtreleme ve Tablo Alanı */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {errorMessage && (
          <div className="m-6 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700">
            {errorMessage}
          </div>
        )}

        {/* Filtreler */}
        <div className="grid gap-3 p-6 border-b border-slate-100 md:grid-cols-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Sipariş no, müşteri adı veya e-posta..."
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as "all" | AdminOrder["status"])}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none transition-colors"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="Hazırlanıyor">Hazırlanıyor</option>
            <option value="Kargolandı">Kargolandı</option>
            <option value="Teslim Edildi">Teslim Edildi</option>
            <option value="İptal Edildi">İptal Edildi</option>
          </select>
          <select
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value as "newest" | "oldest")}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none transition-colors"
          >
            <option value="newest">En Yeni İlk</option>
            <option value="oldest">En Eski İlk</option>
          </select>
        </div>

        {/* Tablo */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Sipariş</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Müşteri</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Ürün Sayısı</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Toplam Tutar</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">Siparişler yükleniyor...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">Filtreye uygun sipariş bulunamadı.</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="transition-colors hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">#{order._id.slice(-6).toUpperCase()}</p>
                      <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString("tr-TR")}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-900">{order.user?.name || "-"}</p>
                      <p className="text-xs text-slate-500">{order.user?.email || "-"}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {order.items?.length || 0} Kalem Ürün
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">
                      {formatCurrency(order.totalAmount || 0)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${statusClassMap[order.status] || "border-slate-200 bg-slate-100 text-slate-600"}`}>
                        {order.status}
                      </span>
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