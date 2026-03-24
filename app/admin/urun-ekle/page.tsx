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
    <section className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -left-16 top-10 h-80 w-80 rounded-full bg-indigo-500/15 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-360 min-w-0">
        <header className="mb-6 min-w-0 rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-2xl sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Ankarom Yönetim</p>
          <h1 className="mt-3 wrap-break-word text-2xl leading-tight font-black text-white sm:text-4xl">Ürün Yönetim Paneli</h1>
          <p className="mt-2 text-sm text-slate-300">Sisteme yeni ürün ekleme ve temel stok bilgilerini yönetme alanı.</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-12">
          <aside className="rounded-3xl border border-white/10 bg-slate-900/75 p-4 shadow-[0_20px_60px_rgba(2,6,23,0.55)] backdrop-blur-2xl lg:col-span-3">
            <p className="px-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Panel Bölümleri</p>
            <div className="mt-3 space-y-2">
              <div className="rounded-xl border border-cyan-300/25 bg-cyan-500/10 px-3 py-2.5 text-sm font-semibold text-cyan-100">Ürün Ekle</div>
              <Link href="/admin/products" className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/5 hover:text-white">
                Ürün Listesi
              </Link>
              <Link href="/admin/orders" className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/5 hover:text-white">
                Sipariş Yönetimi
              </Link>
            </div>

            <div className="mt-6 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Aktif Kullanıcı</p>
                <p className="mt-1 text-sm font-semibold text-white">{user?.name || "-"}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Yetki</p>
                <p className="mt-1 text-sm font-semibold text-cyan-200">{user?.role || "-"}</p>
              </div>
            </div>
          </aside>

          <div className="space-y-6 lg:col-span-9">
            <div className="grid gap-4 sm:grid-cols-3">
              <article className="rounded-2xl border border-white/10 bg-slate-900/75 p-4 shadow-[0_16px_40px_rgba(2,6,23,0.45)] backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">İşlem Türü</p>
                <p className="mt-2 text-lg font-bold text-white">Yeni Ürün Ekleme</p>
              </article>
              <article className="rounded-2xl border border-white/10 bg-slate-900/75 p-4 shadow-[0_16px_40px_rgba(2,6,23,0.45)] backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Hedef</p>
                <p className="mt-2 text-lg font-bold text-white">Ürün Kataloğu</p>
              </article>
              <article className="rounded-2xl border border-white/10 bg-slate-900/75 p-4 shadow-[0_16px_40px_rgba(2,6,23,0.45)] backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Durum</p>
                <p className="mt-2 text-lg font-bold text-cyan-200">Form Hazır</p>
              </article>
            </div>

            <article className="rounded-3xl border border-white/10 bg-slate-900/75 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-2xl sm:p-6">
              <h2 className="text-2xl font-black text-white">Yeni Ürün Bilgileri</h2>
              <p className="mt-2 text-sm text-slate-400">Aşağıdaki alanları doldurup ürünü sisteme kaydedin.</p>

              {!isAuthenticated && (
                <p className="mt-6 rounded-2xl border border-rose-300/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  Ürün eklemek için önce giriş yapmalısınız.
                </p>
              )}

              {isAuthenticated && !isAdmin && (
                <p className="mt-6 rounded-2xl border border-amber-300/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                  Hesabınız admin değil. Bu sayfada ürün ekleme yetkiniz yok.
                </p>
              )}

              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Ürün Adı"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-slate-400 outline-none transition-all focus:border-cyan-400/70"
                />

                <input
                  type="text"
                  placeholder="Fiyat (örn: 2450000 veya ₺2.450.000)"
                  value={currentPrice}
                  onChange={(event) => setCurrentPrice(event.target.value)}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-slate-400 outline-none transition-all focus:border-cyan-400/70"
                />

                <input
                  type="text"
                  placeholder="İndirimli Fiyat (opsiyonel)"
                  value={discountPrice}
                  onChange={(event) => setDiscountPrice(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-slate-400 outline-none transition-all focus:border-cyan-400/70"
                />

                <input
                  type="text"
                  placeholder="Resim URL"
                  value={image}
                  onChange={(event) => setImage(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-slate-400 outline-none transition-all focus:border-cyan-400/70"
                />

                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition-all focus:border-cyan-400/70"
                >
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option} value={option} className="bg-slate-900 text-white">
                      {option}
                    </option>
                  ))}
                </select>

                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Teslimat Bilgisi (Stokta Var)"
                    value={deliveryText}
                    onChange={(event) => setDeliveryText(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-slate-400 outline-none transition-all focus:border-cyan-400/70"
                  />

                  <input
                    type="number"
                    min="0"
                    placeholder="Stok"
                    value={stock}
                    onChange={(event) => setStock(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-slate-400 outline-none transition-all focus:border-cyan-400/70"
                  />
                </div>

                <textarea
                  placeholder="Açıklama"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={5}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-slate-400 outline-none transition-all focus:border-cyan-400/70"
                />

                <textarea
                  placeholder="Özellikler (her satıra bir madde yazın)"
                  value={featuresText}
                  onChange={(event) => setFeaturesText(event.target.value)}
                  rows={5}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white placeholder:text-slate-400 outline-none transition-all focus:border-cyan-400/70"
                />

                {errorMessage && <p className="text-sm text-rose-300">{errorMessage}</p>}
                {successMessage && <p className="text-sm text-emerald-300">{successMessage}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 rounded-2xl bg-slate-950 px-4 py-4 text-lg font-semibold text-white shadow-[0_10px_24px_rgba(2,6,23,0.55)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? "Ekleniyor..." : "Ürünü Kaydet"}
                </button>
              </form>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
