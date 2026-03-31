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
    if (!token) return;

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
    if (!token) return;

    const approved = window.confirm("Bu ürünü silmek istediğinize emin misiniz?");
    if (!approved) return;

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
    // Form açıldığında yukarı kaydır
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setIsSavingEdit(false);
  };

  const handleEditSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!token || !editingProductId) return;

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
    <section className="flex flex-col gap-6">
      {/* Üst Başlık */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Ürün Yönetimi</h2>
          <p className="mt-1 text-sm text-slate-500">Katalog listesi, stok durumları ve fiyatlandırma operasyonları.</p>
        </div>
        <Link
          href="/admin/urun-ekle"
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Yeni Ürün Ekle
        </Link>
      </div>

      {errorMessage && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700">
          {errorMessage}
        </div>
      )}

      {/* Düzenleme Paneli (Sadece düzenleme yaparken görünür) */}
      {editingProductId && (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50/30 p-6 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900">Ürün Bilgilerini Güncelle</h3>
            <p className="text-sm text-slate-600">Yapılan değişiklikler anında katalogda güncellenecektir.</p>
          </div>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Ürün Adı</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, name: event.target.value }))}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Kategori</label>
                <input
                  type="text"
                  value={editForm.category}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, category: event.target.value }))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Normal Fiyat</label>
                <input
                  type="text"
                  value={editForm.price}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, price: event.target.value }))}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">İndirimli Fiyat</label>
                <input
                  type="text"
                  value={editForm.discountPrice}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, discountPrice: event.target.value }))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Stok Adedi</label>
                <input
                  type="number"
                  min="0"
                  value={editForm.stock}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, stock: event.target.value }))}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Görsel URL</label>
                <input
                  type="text"
                  value={editForm.imageUrl}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isSavingEdit}
                className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-bold text-white transition-all hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSavingEdit ? "Kaydediliyor..." : "Güncelle"}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-lg border border-slate-300 bg-white px-6 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                İptal Et
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filtreleme ve Arama */}
      <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Ürün veya kategori ara..."
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
        />
        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
        >
          <option value="all">Tüm Kategoriler</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <select
          value={stockFilter}
          onChange={(event) => setStockFilter(event.target.value as "all" | "in-stock" | "out-of-stock")}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
        >
          <option value="all">Stok Durumu (Hepsi)</option>
          <option value="in-stock">Stokta Olanlar</option>
          <option value="out-of-stock">Tükendi</option>
        </select>
        <select
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value as "newest" | "oldest")}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
        >
          <option value="newest">En Yeni İlk</option>
          <option value="oldest">En Eski İlk</option>
        </select>
      </div>

      {/* Ürün Tablosu */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Ürün Bilgisi</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Kategori</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Normal Fiyat</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">İndirimli Fiyat</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">İndirim Oranı</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Stok</th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {isLoading ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-500">Yükleniyor...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-500">Filtreye uygun ürün bulunamadı.</td></tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="transition-colors hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-900">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{product.category || "Genel"}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{formatCurrency(product.price)}</td>
                    <td className="px-6 py-4 text-sm font-bold text-indigo-600">
                      {typeof product.discountPrice === "number" ? formatCurrency(product.discountPrice) : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-800">
                        %{getDiscountPercent(product.price, product.discountPrice)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-bold ${product.stock <= 0 ? "text-rose-600" : "text-slate-900"}`}>
                        {product.stock} Adet
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(product)}
                          className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100"
                        >
                          Düzenle
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product._id)}
                          className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100"
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
      </div>
    </section>
  );
}