"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";

type ProductRow = {
  _id: string;
  name: string;
  category?: string;
  price: number;
  discountPrice?: number | null;
  stock: number;
  imageUrl?: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);

const getDiscountPercent = (price: number, discountPrice?: number | null) => {
  if (typeof discountPrice !== "number" || discountPrice < 0 || discountPrice >= price) {
    return 0;
  }

  return Math.round(((price - discountPrice) / price) * 100);
};

export default function AdminProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const sortedProducts = useMemo(() => products, [products]);

  const fetchProducts = useCallback(async () => {
    if (!token) {
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = (await response.json()) as ProductRow[] & { message?: string };

      if (!response.ok) {
        throw new Error((data as { message?: string }).message || "Ürünler getirilemedi.");
      }

      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    if (!token) {
      return;
    }

    const approved = window.confirm("Bu ürünü silmek istediğinize emin misiniz?");
    if (!approved) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(data.message || "Ürün silinemedi.");
      }

      setProducts((prev) => prev.filter((product) => product._id !== id));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Silme işlemi sırasında hata oluştu.";
      setErrorMessage(message);
    }
  };

  const handleEdit = async (product: ProductRow) => {
    if (!token) {
      return;
    }

    const nextName = window.prompt("Ürün adı", product.name);
    if (nextName === null) return;

    const nextPriceRaw = window.prompt("Ürün fiyatı", String(product.price));
    if (nextPriceRaw === null) return;

    const nextDiscountPriceRaw = window.prompt("İndirimli fiyat (boş bırakılırsa kaldırılır)", product.discountPrice != null ? String(product.discountPrice) : "");
    if (nextDiscountPriceRaw === null) return;

    const nextStockRaw = window.prompt("Stok", String(product.stock));
    if (nextStockRaw === null) return;

    const nextCategory = window.prompt("Kategori", product.category || "Genel");
    if (nextCategory === null) return;

    const nextImage = window.prompt("Resim URL", product.imageUrl || "");
    if (nextImage === null) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/products/${product._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: nextName,
          price: nextPriceRaw,
          discountPrice: nextDiscountPriceRaw,
          stock: Number(nextStockRaw),
          category: nextCategory,
          imageUrl: nextImage,
        }),
      });

      const data = (await response.json()) as { message?: string; product?: ProductRow };
      if (!response.ok || !data.product) {
        throw new Error(data.message || "Ürün güncellenemedi.");
      }

      setProducts((prev) => prev.map((item) => (item._id === data.product?._id ? data.product : item)));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Güncelleme sırasında hata oluştu.";
      setErrorMessage(message);
    }
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/75 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-2xl sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-white">Ürün Yönetimi</h2>
          <p className="mt-1 text-sm text-slate-400">Ürün listesi, stok ve fiyat operasyonları</p>
        </div>
        <Link
          href="/admin/urun-ekle"
          className="rounded-xl border border-cyan-300/30 bg-cyan-500/10 px-4 py-2.5 text-sm font-semibold text-cyan-100"
        >
          Yeni Ürün Ekle
        </Link>
      </div>

      {errorMessage && <p className="mt-4 text-sm text-rose-300">{errorMessage}</p>}

      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Ürün</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Kategori</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Normal Fiyat</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">İndirimli Fiyat</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">İndirim</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Stok</th>
              <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-3 py-4 text-sm text-slate-300">
                  Ürünler yükleniyor...
                </td>
              </tr>
            ) : sortedProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-4 text-sm text-slate-300">
                  Kayıtlı ürün bulunamadı.
                </td>
              </tr>
            ) : (
              sortedProducts.map((product) => (
                <tr key={product._id} className="rounded-xl border border-white/10 bg-white/5">
                  <td className="rounded-l-xl px-3 py-3 text-sm font-semibold text-white">{product.name}</td>
                  <td className="px-3 py-3 text-sm text-slate-300">{product.category || "Genel"}</td>
                  <td className="px-3 py-3 text-sm font-semibold text-yellow-300">{formatCurrency(product.price)}</td>
                  <td className="px-3 py-3 text-sm font-semibold text-cyan-200">
                    {typeof product.discountPrice === "number" ? formatCurrency(product.discountPrice) : "-"}
                  </td>
                  <td className="px-3 py-3 text-sm text-orange-300">%{getDiscountPercent(product.price, product.discountPrice)}</td>
                  <td className="px-3 py-3 text-sm text-slate-200">{product.stock}</td>
                  <td className="rounded-r-xl px-3 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(product)}
                        className="rounded-lg border border-cyan-300/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-100"
                      >
                        Düzenle
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product._id)}
                        className="rounded-lg border border-rose-300/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-200"
                      >
                        Sil
                      </button>
                    </div>
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
