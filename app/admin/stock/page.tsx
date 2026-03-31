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
    <section className="flex flex-col gap-6">
      {/* Üst Başlık ve Filtreleme Kartı */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Kritik Stok Takibi</h2>
        <p className="mt-1 text-sm text-slate-500">Stoku belirlenen eşik değerinin altında kalan ürünleri yönetin.</p>

        <div className="mt-6 flex flex-wrap items-end gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Eşik Değeri</label>
            <input
              type="number"
              min="1"
              value={threshold}
              onChange={(event) => setThreshold(event.target.value)}
              className="block w-36 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
          
          <button
            type="button"
            onClick={() => fetchStock(threshold)}
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Listeyi Güncelle
          </button>

          <div className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
            Kritik Ürün Sayısı: <span className="ml-2 font-bold text-rose-600">{data?.count ?? 0}</span>
          </div>
        </div>
      </div>

      {/* Veri Tablosu Kartı */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {errorMessage && (
          <div className="m-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700">
            {errorMessage}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Ürün</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Kategori</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Fiyat</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Stok</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Son Güncelleme</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">Stok verisi yükleniyor...</td>
                </tr>
              ) : !data || data.products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">Kritik stokta ürün bulunamadı.</td>
                </tr>
              ) : (
                data.products.map((product) => (
                  <tr key={product._id} className="transition-colors hover:bg-slate-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">{product.name}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{product.category || "Genel"}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900">{formatCurrency(product.price || 0)}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span className="inline-flex items-center rounded-md bg-rose-50 px-2 py-1 text-sm font-bold text-rose-700 ring-1 ring-inset ring-rose-600/10">
                        {product.stock} Adet
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                      {product.updatedAt ? new Date(product.updatedAt).toLocaleDateString("tr-TR") : "-"}
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