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
  createdAt?: string;
};

type EditFormState = {
  name: string;
  price: string;
  discountPrice: string;
  stock: string;
  category: string;
  imageUrl: string;
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
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState<"all" | "in-stock" | "out-of-stock">("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>({
    name: "",
    price: "",
    discountPrice: "",
    stock: "",
    category: "Genel",
    imageUrl: "",
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const categories = useMemo(
    () => Array.from(new Set(products.map((item) => (item.category || "Genel").trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b, "tr")),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase("tr-TR");

    return products
      .filter((product) => {
        if (categoryFilter !== "all" && (product.category || "Genel") !== categoryFilter) {
          return false;
        }

        if (stockFilter === "in-stock" && product.stock <= 0) {
          return false;
        }

        if (stockFilter === "out-of-stock" && product.stock > 0) {
          return false;
        }

        if (!query) {
          return true;
        }

        return `${product.name} ${product.category || "Genel"}`.toLocaleLowerCase("tr-TR").includes(query);
      })
      .sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return sortOrder === "newest" ? bTime - aTime : aTime - bTime;
      });
  }, [products, searchQuery, categoryFilter, stockFilter, sortOrder]);

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

  const handleStartEdit = (product: ProductRow) => {
    setErrorMessage("");
    setEditingProductId(product._id);
    setEditForm({
      name: product.name,
      price: String(product.price),
      discountPrice: product.discountPrice != null ? String(product.discountPrice) : "",
      stock: String(product.stock),
      category: product.category || "Genel",
      imageUrl: product.imageUrl || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setIsSavingEdit(false);
  };

  const handleEditSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!token || !editingProductId) {
      return;
    }

    const nextStock = Number(editForm.stock);
    if (!Number.isFinite(nextStock) || nextStock < 0) {
      setErrorMessage("Stok değeri 0 veya daha büyük bir sayı olmalıdır.");
      return;
    }

    setIsSavingEdit(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/products/${editingProductId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editForm.name,
          price: editForm.price,
          discountPrice: editForm.discountPrice,
          stock: nextStock,
          category: editForm.category,
          imageUrl: editForm.imageUrl,
        }),
      });

      const data = (await response.json()) as { message?: string; product?: ProductRow };
      if (!response.ok || !data.product) {
        throw new Error(data.message || "Ürün güncellenemedi.");
      }

      setProducts((prev) => prev.map((item) => (item._id === data.product?._id ? data.product : item)));
      setEditingProductId(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Güncelleme sırasında hata oluştu.";
      setErrorMessage(message);
    } finally {
      setIsSavingEdit(false);
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

      {editingProductId && (
        <form
          onSubmit={handleEditSubmit}
          className="flex flex-col gap-4 mt-5 rounded-2xl border border-cyan-300/25 bg-cyan-500/5 p-4 sm:p-5"
        >
          <h3 className="text-base font-bold text-white">Ürün Düzenle</h3>
          <p className="mt-1 text-xs text-slate-300">Seçili ürün bilgilerini form üzerinden güncelleyebilirsiniz.</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              value={editForm.name}
              onChange={(event) => setEditForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Ürün adı"
              required
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 outline-none focus:border-cyan-400/70"
            />
            <input
              type="text"
              value={editForm.category}
              onChange={(event) => setEditForm((prev) => ({ ...prev, category: event.target.value }))}
              placeholder="Kategori"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 outline-none focus:border-cyan-400/70"
            />
            <input
              type="text"
              value={editForm.price}
              onChange={(event) => setEditForm((prev) => ({ ...prev, price: event.target.value }))}
              placeholder="Normal fiyat"
              required
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 outline-none focus:border-cyan-400/70"
            />
            <input
              type="text"
              value={editForm.discountPrice}
              onChange={(event) => setEditForm((prev) => ({ ...prev, discountPrice: event.target.value }))}
              placeholder="İndirimli fiyat (opsiyonel)"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 outline-none focus:border-cyan-400/70"
            />
            <input
              type="number"
              min="0"
              value={editForm.stock}
              onChange={(event) => setEditForm((prev) => ({ ...prev, stock: event.target.value }))}
              placeholder="Stok"
              required
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 outline-none focus:border-cyan-400/70"
            />
            <input
              type="text"
              value={editForm.imageUrl}
              onChange={(event) => setEditForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
              placeholder="Resim URL"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 outline-none focus:border-cyan-400/70"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="submit"
              disabled={isSavingEdit}
              className="rounded-lg border border-cyan-300/30 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSavingEdit ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={isSavingEdit}
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Vazgeç
            </button>
          </div>
        </form>
      )}

      <div className="mt-5 grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 md:grid-cols-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Ürün veya kategori ara"
          className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 outline-none focus:border-cyan-400/70"
        />
        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400/70"
        >
          <option value="all" className="bg-slate-900">Tüm Kategoriler</option>
          {categories.map((category) => (
            <option key={category} value={category} className="bg-slate-900">
              {category}
            </option>
          ))}
        </select>
        <select
          value={stockFilter}
          onChange={(event) => setStockFilter(event.target.value as "all" | "in-stock" | "out-of-stock")}
          className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400/70"
        >
          <option value="all" className="bg-slate-900">Tüm Stoklar</option>
          <option value="in-stock" className="bg-slate-900">Stokta Olanlar</option>
          <option value="out-of-stock" className="bg-slate-900">Stokta Olmayanlar</option>
        </select>
        <select
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value as "newest" | "oldest")}
          className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400/70"
        >
          <option value="newest" className="bg-slate-900">En Yeni</option>
          <option value="oldest" className="bg-slate-900">En Eski</option>
        </select>
      </div>

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
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-4 text-sm text-slate-300">
                  Filtreye uygun ürün bulunamadı.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
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
                        onClick={() => handleStartEdit(product)}
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
