"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type SettingsResponse = {
  _id: string;
  siteName: string;
  supportEmail: string;
  supportPhone: string;
  freeShippingThreshold: number;
  lowStockThreshold: number;
  maintenanceMode: boolean;
  allowGuestCheckout: boolean;
  homepageAnnouncement: string;
};

export default function AdminSettingsPage() {
  const { token } = useAuth();

  const [siteName, setSiteName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [supportPhone, setSupportPhone] = useState("");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("0");
  const [lowStockThreshold, setLowStockThreshold] = useState("10");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowGuestCheckout, setAllowGuestCheckout] = useState(true);
  const [homepageAnnouncement, setHomepageAnnouncement] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      if (!token) return;

      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/settings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = (await response.json()) as SettingsResponse & { message?: string };

        if (!response.ok) {
          throw new Error(data.message || "Ayarlar getirilemedi.");
        }

        setSiteName(data.siteName || "");
        setSupportEmail(data.supportEmail || "");
        setSupportPhone(data.supportPhone || "");
        setFreeShippingThreshold(String(data.freeShippingThreshold ?? 0));
        setLowStockThreshold(String(data.lowStockThreshold ?? 10));
        setMaintenanceMode(Boolean(data.maintenanceMode));
        setAllowGuestCheckout(Boolean(data.allowGuestCheckout));
        setHomepageAnnouncement(data.homepageAnnouncement || "");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Ayarlar yüklenirken hata oluştu.";
        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [token]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) return;

    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          siteName,
          supportEmail,
          supportPhone,
          freeShippingThreshold,
          lowStockThreshold,
          maintenanceMode,
          allowGuestCheckout,
          homepageAnnouncement,
        }),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message || "Ayarlar güncellenemedi.");
      }

      setSuccessMessage(data.message || "Ayarlar güncellendi.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Ayarlar güncellenirken hata oluştu.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-6 flex flex-col gap-4">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/75 p-6 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-2xl sm:p-7">
        <div className="pointer-events-none absolute -right-10 top-0 h-36 w-36 rounded-full bg-cyan-500/15 blur-3xl" />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Sistem Konfigürasyonu</p>
        <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">Ayarlar</h2>
        <p className="mt-2 text-sm text-slate-400">Platform davranışını, sipariş eşiklerini ve iletişim ayarlarını tek panelden yönetin.</p>
      </div>

      {isLoading ? (
        <div className="rounded-3xl border border-white/10 bg-slate-900/75 p-6 text-sm text-slate-300 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-2xl">
          Ayarlar yükleniyor...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Site Adı</p>
              <p className="mt-2 text-lg font-bold text-white">{siteName || "-"}</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Misafir Ödeme</p>
              <p className="mt-2 text-lg font-bold text-cyan-200">{allowGuestCheckout ? "Açık" : "Kapalı"}</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Bakım Modu</p>
              <p className="mt-2 text-lg font-bold text-amber-200">{maintenanceMode ? "Aktif" : "Pasif"}</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Düşük Stok Limiti</p>
              <p className="mt-2 text-lg font-bold text-white">{lowStockThreshold}</p>
            </article>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/75 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-2xl sm:p-6">
            <h3 className="text-lg font-bold text-white">Genel Bilgiler</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Site Adı</span>
                <input
                  type="text"
                  value={siteName}
                  onChange={(event) => setSiteName(event.target.value)}
                  placeholder="Site adı"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:border-cyan-400/70"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Destek E-Posta</span>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(event) => setSupportEmail(event.target.value)}
                  placeholder="Destek e-posta"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:border-cyan-400/70"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Destek Telefon</span>
                <input
                  type="text"
                  value={supportPhone}
                  onChange={(event) => setSupportPhone(event.target.value)}
                  placeholder="Destek telefon"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:border-cyan-400/70"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Ana Sayfa Duyurusu</span>
                <input
                  type="text"
                  value={homepageAnnouncement}
                  onChange={(event) => setHomepageAnnouncement(event.target.value)}
                  placeholder="Kısa duyuru başlığı"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:border-cyan-400/70"
                />
              </label>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/75 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-2xl sm:p-6">
            <h3 className="text-lg font-bold text-white">Operasyon Eşikleri</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Ücretsiz Kargo Limiti</span>
                <input
                  type="number"
                  min="0"
                  value={freeShippingThreshold}
                  onChange={(event) => setFreeShippingThreshold(event.target.value)}
                  placeholder="Ücretsiz kargo limiti"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:border-cyan-400/70"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Düşük Stok Limiti</span>
                <input
                  type="number"
                  min="0"
                  value={lowStockThreshold}
                  onChange={(event) => setLowStockThreshold(event.target.value)}
                  placeholder="Düşük stok limiti"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:border-cyan-400/70"
                />
              </label>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/75 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-2xl sm:p-6">
            <h3 className="text-lg font-bold text-white">Sistem Durumu</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <button
                type="button"
                onClick={() => setMaintenanceMode((prev) => !prev)}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left"
              >
                <span>
                  <p className="text-sm font-semibold text-white">Bakım Modu</p>
                  <p className="mt-1 text-xs text-slate-400">Site erişimini geçici olarak kısıtlar.</p>
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${maintenanceMode ? "border border-amber-300/30 bg-amber-500/10 text-amber-200" : "border border-white/20 bg-white/5 text-slate-200"}`}>
                  {maintenanceMode ? "Aktif" : "Pasif"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setAllowGuestCheckout((prev) => !prev)}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left"
              >
                <span>
                  <p className="text-sm font-semibold text-white">Misafir Ödeme</p>
                  <p className="mt-1 text-xs text-slate-400">Giriş yapmadan siparişe izin verir.</p>
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${allowGuestCheckout ? "border border-cyan-300/30 bg-cyan-500/10 text-cyan-200" : "border border-white/20 bg-white/5 text-slate-200"}`}>
                  {allowGuestCheckout ? "Açık" : "Kapalı"}
                </span>
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/75 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-2xl sm:p-6">
            <h3 className="text-lg font-bold text-white">Duyuru Metni</h3>
            <textarea
              value={homepageAnnouncement}
              onChange={(event) => setHomepageAnnouncement(event.target.value)}
              placeholder="Ana sayfa duyuru metni"
              rows={4}
              className="mt-4 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:border-cyan-400/70"
            />

            {errorMessage && <p className="mt-4 text-sm text-rose-300">{errorMessage}</p>}
            {successMessage && <p className="mt-4 text-sm text-emerald-300">{successMessage}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 w-full rounded-2xl border border-cyan-300/30 bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Kaydediliyor..." : "Ayarları Kaydet"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
