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

      setSuccessMessage(data.message || "Ayarlar başarıyla güncellendi.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Ayarlar güncellenirken hata oluştu.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex flex-col gap-6">
      {/* Sayfa Başlığı */}
      <header className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Sistem Konfigürasyonu</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">Genel Ayarlar</h2>
        <p className="mt-1 text-sm text-slate-500">Platform davranışını ve operasyonel eşikleri buradan yönetebilirsiniz.</p>
      </header>

      {isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-sm font-medium text-slate-500 shadow-sm">
          Ayarlar yükleniyor...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Özet Kartları */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Site Adı</p>
              <p className="mt-1 text-lg font-bold text-slate-900">{siteName || "-"}</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Misafir Ödeme</p>
              <p className={`mt-1 text-lg font-bold ${allowGuestCheckout ? "text-emerald-600" : "text-slate-400"}`}>
                {allowGuestCheckout ? "Aktif" : "Devre Dışı"}
              </p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Bakım Modu</p>
              <p className={`mt-1 text-lg font-bold ${maintenanceMode ? "text-amber-600" : "text-slate-400"}`}>
                {maintenanceMode ? "YAYINDA DEĞİL" : "YAYINDA"}
              </p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Düşük Stok</p>
              <p className="mt-1 text-lg font-bold text-rose-600">{lowStockThreshold} Adet</p>
            </article>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* İletişim Bilgileri */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5">İletişim ve Kimlik</h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Site Adı</label>
                  <input
                    type="text"
                    value={siteName}
                    onChange={(event) => setSiteName(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Destek E-Posta</label>
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={(event) => setSupportEmail(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Destek Telefon</label>
                  <input
                    type="text"
                    value={supportPhone}
                    onChange={(event) => setSupportPhone(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Operasyonel Limitler */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5">Operasyonel Limitler</h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Ücretsiz Kargo Eşiği (₺)</label>
                  <input
                    type="number"
                    min="0"
                    value={freeShippingThreshold}
                    onChange={(event) => setFreeShippingThreshold(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Düşük Stok Uyarı Limiti (Adet)</label>
                  <input
                    type="number"
                    min="0"
                    value={lowStockThreshold}
                    onChange={(event) => setLowStockThreshold(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sistem Durumu Kontrolleri */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5">Sistem Durumu</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <button
                type="button"
                onClick={() => setMaintenanceMode((prev) => !prev)}
                className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all ${
                  maintenanceMode ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div>
                  <p className="text-sm font-bold text-slate-900">Bakım Modu</p>
                  <p className="text-xs text-slate-500">Aktif olduğunda site ziyaretçilere kapatılır.</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${maintenanceMode ? "bg-amber-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                  {maintenanceMode ? "AKTİF" : "PASİF"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setAllowGuestCheckout((prev) => !prev)}
                className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all ${
                  allowGuestCheckout ? "border-indigo-200 bg-indigo-50" : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div>
                  <p className="text-sm font-bold text-slate-900">Misafir Ödeme</p>
                  <p className="text-xs text-slate-500">Üyelik zorunluluğunu kaldırır.</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${allowGuestCheckout ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                  {allowGuestCheckout ? "AÇIK" : "KAPALI"}
                </span>
              </button>
            </div>
          </div>

          {/* Duyuru Metni */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5">Duyuru Paneli</h3>
            <textarea
              value={homepageAnnouncement}
              onChange={(event) => setHomepageAnnouncement(event.target.value)}
              placeholder="Ana sayfa üst bandında görünecek mesaj..."
              rows={4}
              className="w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />

            <div className="mt-6 flex flex-col items-center gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:justify-between">
              <div className="w-full sm:w-auto">
                {errorMessage && <p className="text-sm font-semibold text-rose-600">{errorMessage}</p>}
                {successMessage && <p className="text-sm font-semibold text-emerald-600">{successMessage}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-indigo-600 px-8 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {isSubmitting ? "Güncelleniyor..." : "Ayarları Kaydet"}
              </button>
            </div>
          </div>
        </form>
      )}
    </section>
  );
}