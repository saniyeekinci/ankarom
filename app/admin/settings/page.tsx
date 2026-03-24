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
    <section className="rounded-3xl border border-white/10 bg-slate-900/75 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-2xl sm:p-6">
      <h2 className="text-2xl font-black text-white">Ayarlar</h2>
      <p className="mt-1 text-sm text-slate-400">Sistem ayarlarını bu panelden yönetin.</p>

      {isLoading ? (
        <p className="mt-5 text-sm text-slate-300">Ayarlar yükleniyor...</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5 grid gap-4 md:grid-cols-2">
          <input
            type="text"
            value={siteName}
            onChange={(event) => setSiteName(event.target.value)}
            placeholder="Site adı"
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:border-cyan-400/70"
          />

          <input
            type="email"
            value={supportEmail}
            onChange={(event) => setSupportEmail(event.target.value)}
            placeholder="Destek e-posta"
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:border-cyan-400/70"
          />

          <input
            type="text"
            value={supportPhone}
            onChange={(event) => setSupportPhone(event.target.value)}
            placeholder="Destek telefon"
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:border-cyan-400/70"
          />

          <input
            type="number"
            min="0"
            value={freeShippingThreshold}
            onChange={(event) => setFreeShippingThreshold(event.target.value)}
            placeholder="Ücretsiz kargo limiti"
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:border-cyan-400/70"
          />

          <input
            type="number"
            min="0"
            value={lowStockThreshold}
            onChange={(event) => setLowStockThreshold(event.target.value)}
            placeholder="Düşük stok limiti"
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:border-cyan-400/70"
          />

          <label className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
            <input type="checkbox" checked={maintenanceMode} onChange={(event) => setMaintenanceMode(event.target.checked)} />
            Bakım modu aktif
          </label>

          <label className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
            <input type="checkbox" checked={allowGuestCheckout} onChange={(event) => setAllowGuestCheckout(event.target.checked)} />
            Misafir ödeme izinli
          </label>

          <textarea
            value={homepageAnnouncement}
            onChange={(event) => setHomepageAnnouncement(event.target.value)}
            placeholder="Ana sayfa duyuru metni"
            rows={4}
            className="md:col-span-2 resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:border-cyan-400/70"
          />

          {errorMessage && <p className="md:col-span-2 text-sm text-rose-300">{errorMessage}</p>}
          {successMessage && <p className="md:col-span-2 text-sm text-emerald-300">{successMessage}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="md:col-span-2 rounded-2xl border border-cyan-300/30 bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Kaydediliyor..." : "Ayarları Kaydet"}
          </button>
        </form>
      )}
    </section>
  );
}
