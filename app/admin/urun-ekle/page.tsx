"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const CATEGORY_OPTIONS = [
  "Araç Römorkları",
  "ATV Römorkları",
  "Tekne Römorkları",
  "Motosiklet Römorkları",
  "Jet Ski Römorkları",
  "Platform Römorklar",
  "Kapalı Kasa Römorklar",
  "Özel Üretim Römorklar",
  "Yedek Parça ve Ekipman",
  "Genel",
];

export default function AdminUrunEklePage() {
  const router = useRouter();
  const { token, user, isAuthenticated } = useAuth();

  const [name, setName] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [featuresText, setFeaturesText] = useState("");
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [deliveryText, setDeliveryText] = useState("Stokta Var");
  const [stock, setStock] = useState("0");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isAdmin = useMemo(() => user?.role === "admin", [user]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/giris");
    }
  }, [isAuthenticated, user, router]);

  const resetForm = () => {
    setName("");
    setCurrentPrice("");
    setDiscountPrice("");
    setImage("");
    setDescription("");
    setFeaturesText("");
    setCategory(CATEGORY_OPTIONS[0]);
    setDeliveryText("Stokta Var");
    setStock("0");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!token) {
      setErrorMessage("Ürün eklemek için giriş yapmalısınız.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          price: currentPrice,
          discountPrice,
          imageUrl: image,
          category,
          stock,
          description,
          deliveryInfo: deliveryText,
          features: featuresText
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter(Boolean),
        }),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message || "Ürün eklenirken bir hata oluştu.");
      }

      setSuccessMessage("Ürün başarıyla eklendi.");
      resetForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : "İşlem sırasında beklenmeyen bir hata oluştu.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Sayfa Başlığı */}
      <header className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Ankarom Yönetim</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Ürün Yönetim Paneli</h1>
        <p className="mt-1 text-sm text-slate-500">Sisteme yeni ürün ekleme ve temel stok bilgilerini yönetme alanı.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-12">
        
        {/* Sol Menü / Kısayollar */}
        <aside className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-3 h-fit">
          <p className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Panel Bölümleri</p>
          <div className="mt-2 space-y-1">
            <div className="rounded-lg bg-indigo-50 px-3 py-2.5 text-sm font-semibold text-indigo-700">
              Ürün Ekle
            </div>
            <Link href="/admin/products" className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900">
              Ürün Listesi
            </Link>
            <Link href="/admin/orders" className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900">
              Sipariş Yönetimi
            </Link>
          </div>
        </aside>

        {/* Ana İçerik */}
        <div className="space-y-6 lg:col-span-9 flex flex-col gap-2">
          
          {/* Durum Kartları */}
          <div className="grid gap-4 sm:grid-cols-3">
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">İşlem Türü</p>
              <p className="mt-1 text-lg font-bold text-slate-900">Yeni Ürün Ekleme</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Hedef</p>
              <p className="mt-1 text-lg font-bold text-slate-900">Ürün Kataloğu</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Durum</p>
              <p className="mt-1 text-lg font-bold text-indigo-600">Form Hazır</p>
            </article>
          </div>

          {/* Form Alanı */}
          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-slate-900">Yeni Ürün Bilgileri</h2>
            <p className="mt-1 text-sm text-slate-500">Aşağıdaki alanları eksiksiz doldurup ürünü sisteme kaydedin.</p>

            {/* Uyarı Mesajları */}
            {!isAuthenticated && (
              <div className="mt-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                Ürün eklemek için önce giriş yapmalısınız.
              </div>
            )}

            {isAuthenticated && !isAdmin && (
              <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                Hesabınız admin değil. Bu sayfada ürün ekleme yetkiniz bulunmamaktadır.
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Ürün Adı *</label>
                <input
                  type="text"
                  placeholder="Örn: Kapalı Kasa Römork"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Satış Fiyatı *</label>
                  <input
                    type="text"
                    placeholder="Örn: 2450000"
                    value={currentPrice}
                    onChange={(event) => setCurrentPrice(event.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">İndirimli Fiyat (Opsiyonel)</label>
                  <input
                    type="text"
                    placeholder="Örn: 2350000"
                    value={discountPrice}
                    onChange={(event) => setDiscountPrice(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Ürün Görsel URLsi</label>
                <input
                  type="text"
                  placeholder="https://ornek-resim-url.com/resim.jpg"
                  value={image}
                  onChange={(event) => setImage(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Kategori</label>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                >
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Teslimat Bilgisi</label>
                  <input
                    type="text"
                    placeholder="Örn: Stokta Var"
                    value={deliveryText}
                    onChange={(event) => setDeliveryText(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Stok Adedi</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={stock}
                    onChange={(event) => setStock(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Açıklama</label>
                <textarea
                  placeholder="Ürün hakkında genel açıklama yazın..."
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={4}
                  className="w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Teknik Özellikler</label>
                <p className="text-xs text-slate-500 mb-1">Her bir özelliği ayrı satıra yazınız.</p>
                <textarea
                  placeholder="Kapasite: 750 KG&#10;Renk: Galvaniz Gri&#10;Tekerlek: 13 İnç"
                  value={featuresText}
                  onChange={(event) => setFeaturesText(event.target.value)}
                  rows={4}
                  className="w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>

              {/* Geri Bildirim Mesajları */}
              {errorMessage && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700">
                  {errorMessage}
                </div>
              )}
              {successMessage && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
                  {successMessage}
                </div>
              )}

              {/* Gönder Butonu */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {isSubmitting ? "Kaydediliyor..." : "Ürünü Kaydet"}
                </button>
              </div>
            </form>
          </article>
        </div>
      </div>
    </div>
  );
}