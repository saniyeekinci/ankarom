"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type StockResponse = {
  threshold: number;
  count: number;
  products: Array<{
    _id: string;
    name: string;
    category?: string;
    price: number;
    stock: number;
    imageUrl?: string;
    updatedAt?: string;
  }>;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);

export default function AdminStockPage() {
  const { token } = useAuth();
  const [threshold, setThreshold] = useState("10");
  const [data, setData] = useState<StockResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchStock = useCallback(async (currentThreshold: string) => {
    if (!token) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const query = new URLSearchParams({ threshold: currentThreshold }).toString();
      const response = await fetch(`${API_BASE_URL}/api/admin/stock?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const payload = (await response.json()) as StockResponse & { message?: string };
      if (!response.ok) {
        throw new Error(payload.message || "Stok verisi getirilemedi.");
      }

      setData(payload);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Stok verisi alınırken hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchStock(threshold);
  }, [fetchStock, threshold]);

  return (
    <section className="space-y-6 flex flex-col gap-4">
      <div className=" rounded-3xl border border-white/10 bg-slate-900/75 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-2xl sm:p-6">
        <h2 className="text-2xl font-black text-white">Kritik Stok Takibi</h2>
        <p className="mt-1 text-sm text-slate-400">Stoku belirlenen eşik değerinin altında kalan ürünleri görüntüleyin.</p>

        <div className="mt-5 flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Eşik Değeri</span>
            <input
              type="number"
              min="1"
              value={threshold}
              onChange={(event) => setThreshold(event.target.value)}
              className="w-36 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
            />
          </label>
          <button
            type="button"
            onClick={() => fetchStock(threshold)}
            className="rounded-xl border border-cyan-300/30 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-100"
          >
            Listeyi Güncelle
          </button>
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
            Kritik Ürün Sayısı: <span className="font-bold text-rose-200">{data?.count ?? 0}</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-white/10 bg-slate-900/75 p-4 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-2xl sm:p-6">
        {errorMessage && <p className="mb-4 text-sm text-rose-300">{errorMessage}</p>}

        <table className="min-w-full border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Ürün</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Kategori</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Fiyat</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Stok</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Son Güncelleme</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-3 py-4 text-sm text-slate-300">Stok verisi yükleniyor...</td>
              </tr>
            ) : !data || data.products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-4 text-sm text-slate-300">Kritik stokta ürün bulunamadı.</td>
              </tr>
            ) : (
              data.products.map((product) => (
                <tr key={product._id} className="rounded-xl border border-white/10 bg-white/5">
                  <td className="rounded-l-xl px-3 py-3 text-sm font-semibold text-white">{product.name}</td>
                  <td className="px-3 py-3 text-sm text-slate-300">{product.category || "Genel"}</td>
                  <td className="px-3 py-3 text-sm font-semibold text-yellow-300">{formatCurrency(product.price || 0)}</td>
                  <td className="px-3 py-3 text-sm font-bold text-rose-200">{product.stock}</td>
                  <td className="rounded-r-xl px-3 py-3 text-sm text-slate-400">
                    {product.updatedAt ? new Date(product.updatedAt).toLocaleDateString("tr-TR") : "-"}
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
