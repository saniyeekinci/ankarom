"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, LifebuoyIcon, ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/components/auth/AuthProvider";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function SupportRequestPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/giris");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const customer = String(formData.get("customer") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const priority = String(formData.get("priority") || "Orta");
    const message = String(formData.get("message") || "").trim();

    if (!customer || !subject || !message) {
      setErrorMessage("Ad soyad, konu ve mesaj alanları zorunludur.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/public/support-tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer, subject, priority, message }),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message || "Destek talebi gönderilemedi.");
      }

      form.reset();
      setSuccessMessage(data.message || "Destek talebiniz başarıyla alındı.");
    } catch (error) {
      const messageText = error instanceof Error ? error.message : "Destek talebi gönderilemedi.";
      setErrorMessage(messageText);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="pointer-events-none absolute -left-20 top-8 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-360 space-y-6">
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.55)] backdrop-blur-2xl sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <LifebuoyIcon className="h-5 w-5 text-cyan-300" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Hesabım</p>
                <h1 className="mt-1 text-2xl font-black text-white">Destek Al</h1>
                <p className="mt-1 text-sm text-slate-300">Sorununuzu yazın, destek ekibimiz size en kısa sürede dönüş yapsın.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Geri
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <form onSubmit={handleSubmit} className="lg:col-span-8 rounded-3xl border border-white/10 bg-linear-to-b from-slate-900/80 to-slate-950/85 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-xl sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 sm:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Ad Soyad</span>
                <input
                  name="customer"
                  type="text"
                  defaultValue={user.name || ""}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:border-cyan-400/70"
                  placeholder="Ad Soyad"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Konu</span>
                <input
                  name="subject"
                  type="text"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:border-cyan-400/70"
                  placeholder="Örn: Sipariş takibi"
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Öncelik</span>
                <select
                  name="priority"
                  defaultValue="Orta"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-400/70"
                >
                  <option value="Düşük" className="bg-slate-900">Düşük</option>
                  <option value="Orta" className="bg-slate-900">Orta</option>
                  <option value="Yüksek" className="bg-slate-900">Yüksek</option>
                </select>
              </label>

              <label className="space-y-2 sm:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Mesaj</span>
                <textarea
                  name="message"
                  rows={6}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:border-cyan-400/70"
                  placeholder="Yaşadığınız sorunu detaylı şekilde yazın"
                />
              </label>
            </div>

            {errorMessage && (
              <p className="mt-4 rounded-xl border border-rose-300/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-200">
                {errorMessage}
              </p>
            )}

            {successMessage && (
              <p className="mt-4 rounded-xl border border-emerald-300/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200">
                {successMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-5 inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-indigo-500 to-cyan-500 px-5 py-3 text-sm font-bold text-white shadow-[0_10px_26px_rgba(59,130,246,0.35)] transition-all hover:-translate-y-0.5 disabled:opacity-70"
            >
              {isSubmitting ? "Gönderiliyor..." : "Destek Talebi Gönder"}
            </button>
          </form>

          <aside className="lg:col-span-4 rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-xl sm:p-6">
            <div className="flex items-center gap-2">
              <ChatBubbleBottomCenterTextIcon className="h-5 w-5 text-cyan-300" />
              <h2 className="text-lg font-bold text-white">Destek İpuçları</h2>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">Sipariş kodunuzu yazarsanız süreç hızlanır.</li>
              <li className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">Tekrarlanabilir adımları kısaca belirtin.</li>
              <li className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">Öncelik seviyesini doğru seçin.</li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
