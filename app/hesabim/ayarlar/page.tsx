"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  Cog6ToothIcon,
  BellIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/components/auth/AuthProvider";

export default function AccountSettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, updateProfile } = useAuth();
  const [marketingEmail, setMarketingEmail] = useState(true);
  const [orderSms, setOrderSms] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/giris");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setMessage("");
    setIsSaving(true);

    try {
      const formData = new FormData(event.currentTarget);

      await updateProfile({
        name: String(formData.get("fullName") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        phone: String(formData.get("phone") || "").trim(),
        currentPassword: currentPassword.trim() || undefined,
        newPassword: newPassword.trim() || undefined,
      });

      setCurrentPassword("");
      setNewPassword("");
      setMessage("Ayarlarınız başarıyla güncellendi.");
    } catch (error) {
      const errorText = error instanceof Error ? error.message : "Ayarlar güncellenemedi.";
      setErrorMessage(errorText);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className=" relative overflow-hidden px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="pointer-events-none absolute -left-20 top-8 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="flex flex-col gap-4 relative mx-auto w-full max-w-360 space-y-6">
        <div className="flex justify-between gap-4 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/75 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-2xl sm:p-6">
          <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-cyan-500/15 blur-3xl" />

          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <Cog6ToothIcon className="h-5 w-5 text-cyan-300" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Kullanıcı Paneli</p>
              <h1 className="mt-1 text-2xl font-black text-white">Hesap Ayarlarım</h1>
              <p className="mt-1 text-sm text-slate-300">Profil, güvenlik ve bildirim tercihlerini tek ekrandan yönet.</p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Hesap Tipi</p>
              <p className="mt-2 text-sm font-bold text-white">{user.role === "admin" ? "Yönetici" : "Standart Kullanıcı"}</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Bildirim Durumu</p>
              <p className="mt-2 text-sm font-bold text-cyan-200">{marketingEmail || orderSms ? "Aktif" : "Pasif"}</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Güvenlik</p>
              <p className="mt-2 text-sm font-bold text-emerald-200">Doğrulandı</p>
            </article>
          </div>

          <button
            type="button"
            onClick={() => router.back()}
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Geri
          </button>
        </div>

        <form onSubmit={handleSave} className="grid gap-6 lg:grid-cols-12">
          <article className="flex flex-col gap-4 lg:col-span-7 rounded-3xl border border-white/10 bg-linear-to-b from-slate-900/80 to-slate-950/85 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-xl sm:p-6">
            <div className="flex items-center gap-2">
              <UserCircleIcon className="h-5 w-5 text-cyan-300" />
              <h2 className="text-lg font-bold text-white">Profil Bilgileri</h2>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 sm:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Ad Soyad</span>
                <input
                  name="fullName"
                  defaultValue={user.name || ""}
                  type="text"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:border-cyan-400/70"
                  placeholder="Ad soyad"
                />
              </label>

              <label className="space-y-2 sm:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">E-Posta</span>
                <input
                  name="email"
                  defaultValue={user.email || ""}
                  type="email"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:border-cyan-400/70"
                  placeholder="E-posta"
                />
              </label>

              <label className="space-y-2 sm:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Telefon</span>
                <input
                  name="phone"
                  defaultValue={user.phone || ""}
                  type="text"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:border-cyan-400/70"
                  placeholder="Telefon"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Mevcut Şifre</span>
                <input
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  type="password"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:border-cyan-400/70"
                  placeholder="Mevcut şifreniz"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Yeni Şifre</span>
                <input
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  type="password"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:border-cyan-400/70"
                  placeholder="Yeni şifre (opsiyonel)"
                />
              </label>
            </div>
          </article>

          <div className="flex flex-col gap-4 lg:col-span-5 space-y-6">
            <article className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-linear-to-b from-slate-900/80 to-slate-950/85 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-xl sm:p-6">
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="h-5 w-5 text-emerald-300" />
                <h2 className="text-lg font-bold text-white">Güvenlik</h2>
              </div>
              <p className="mt-3 text-sm text-slate-300">Şifre değişikliği için profil alanındaki mevcut/yeni şifreyi doldurup kaydedin.</p>
              <button
                type="button"
                className="mt-4 w-full rounded-2xl border border-emerald-300/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200"
              >
                Şifre Alanı Aşağıda
              </button>
            </article>

            <article className="rounded-3xl border border-white/10 bg-linear-to-b from-slate-900/80 to-slate-950/85 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-xl sm:p-6">
              <div className="flex items-center gap-2">
                <BellIcon className="h-5 w-5 text-cyan-300" />
                <h2 className="text-lg font-bold text-white">Bildirim Tercihleri</h2>
              </div>

              <div className="mt-4 space-y-3 flex flex-col gap-4">
                <button
                  type="button"
                  onClick={() => setMarketingEmail((prev) => !prev)}
                  className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left"
                >
                  <span className="text-sm font-semibold text-white">Kampanya E-postaları</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${marketingEmail ? "border border-cyan-300/30 bg-cyan-500/10 text-cyan-200" : "border border-white/20 bg-white/5 text-slate-200"}`}>
                    {marketingEmail ? "Açık" : "Kapalı"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderSms((prev) => !prev)}
                  className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left"
                >
                  <span className="text-sm font-semibold text-white">Sipariş SMS Bildirimleri</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${orderSms ? "border border-cyan-300/30 bg-cyan-500/10 text-cyan-200" : "border border-white/20 bg-white/5 text-slate-200"}`}>
                    {orderSms ? "Açık" : "Kapalı"}
                  </span>
                </button>
              </div>
            </article>
          </div>

          <div className="lg:col-span-12 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/10 bg-slate-900/75 p-4 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-2xl sm:p-5">
            <p className="text-sm text-slate-300">Değişiklikleri kaydettiğinde tercihlerin hesabına uygulanır.</p>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-indigo-500 to-cyan-500 px-5 py-3 text-sm font-bold text-white shadow-[0_10px_26px_rgba(59,130,246,0.35)] transition-all hover:-translate-y-0.5 disabled:opacity-70"
            >
              <CheckBadgeIcon className="h-5 w-5" />
              {isSaving ? "Kaydediliyor..." : "Ayarları Kaydet"}
            </button>
          </div>

          {message && (
            <div className="lg:col-span-12 rounded-2xl border border-emerald-300/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200">
              {message}
            </div>
          )}

          {errorMessage && (
            <div className="lg:col-span-12 rounded-2xl border border-rose-300/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-200">
              {errorMessage}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}