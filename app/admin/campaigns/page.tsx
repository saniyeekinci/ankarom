"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

type CampaignRow = {
  _id: string;
  title: string;
  code: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  minimumSpend: number;
  startsAt?: string | null;
  endsAt?: string | null;
  isActive: boolean;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const toDateInputValue = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 16);
};

export default function AdminCampaignsPage() {
  const { token } = useAuth();
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percent" | "fixed">("percent");
  const [discountValue, setDiscountValue] = useState("");
  const [minimumSpend, setMinimumSpend] = useState("0");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [isActive, setIsActive] = useState(true);

  const totalCampaigns = useMemo(() => campaigns.length, [campaigns]);
  const activeCampaigns = useMemo(() => campaigns.filter((campaign) => campaign.isActive).length, [campaigns]);

  const resetForm = () => {
    setTitle("");
    setCode("");
    setDiscountType("percent");
    setDiscountValue("");
    setMinimumSpend("0");
    setStartsAt("");
    setEndsAt("");
    setIsActive(true);
  };

  const fetchCampaigns = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/campaigns`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = (await response.json()) as CampaignRow[] & { message?: string };

      if (!response.ok) {
        throw new Error((data as { message?: string }).message || "Kampanyalar getirilemedi.");
      }

      setCampaigns(Array.isArray(data) ? data : []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleCreateCampaign = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) return;

    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/campaigns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          code,
          discountType,
          discountValue,
          minimumSpend,
          startsAt,
          endsAt,
          isActive,
        }),
      });

      const data = (await response.json()) as { message?: string; campaign?: CampaignRow };

      if (!response.ok || !data.campaign) {
        throw new Error(data.message || "Kampanya oluşturulamadı.");
      }

      setCampaigns((prev) => [data.campaign as CampaignRow, ...prev]);
      setSuccessMessage("Kampanya başarıyla oluşturuldu.");
      resetForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Kampanya oluşturma sırasında hata oluştu.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (campaign: CampaignRow) => {
    if (!token) return;

    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/campaigns/${campaign._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isActive: !campaign.isActive,
        }),
      });

      const data = (await response.json()) as { message?: string; campaign?: CampaignRow };
      if (!response.ok || !data.campaign) {
        throw new Error(data.message || "Kampanya durumu güncellenemedi.");
      }

      setCampaigns((prev) => prev.map((item) => (item._id === data.campaign?._id ? (data.campaign as CampaignRow) : item)));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Kampanya durumu güncellenirken hata oluştu.";
      setErrorMessage(message);
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    if (!token) return;

    const approved = window.confirm("Bu kampanyayı silmek istediğinize emin misiniz?");
    if (!approved) return;

    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/campaigns/${campaignId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(data.message || "Kampanya silinemedi.");
      }

      setCampaigns((prev) => prev.filter((item) => item._id !== campaignId));
      setSuccessMessage("Kampanya silindi.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Kampanya silinirken hata oluştu.";
      setErrorMessage(message);
    }
  };

  const handleEditCampaign = async (campaign: CampaignRow) => {
    if (!token) return;

    const nextTitle = window.prompt("Kampanya başlığı", campaign.title);
    if (nextTitle === null) return;

    const nextCode = window.prompt("Kampanya kodu", campaign.code);
    if (nextCode === null) return;

    const nextDiscountType = window.prompt("İndirim tipi (percent/fixed)", campaign.discountType);
    if (nextDiscountType === null) return;

    const nextDiscountValue = window.prompt("İndirim değeri", String(campaign.discountValue));
    if (nextDiscountValue === null) return;

    const nextMinimumSpend = window.prompt("Minimum harcama", String(campaign.minimumSpend || 0));
    if (nextMinimumSpend === null) return;

    const nextStartsAt = window.prompt("Başlangıç tarihi (YYYY-MM-DDTHH:mm)", toDateInputValue(campaign.startsAt));
    if (nextStartsAt === null) return;

    const nextEndsAt = window.prompt("Bitiş tarihi (YYYY-MM-DDTHH:mm)", toDateInputValue(campaign.endsAt));
    if (nextEndsAt === null) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/campaigns/${campaign._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: nextTitle,
          code: nextCode,
          discountType: nextDiscountType,
          discountValue: nextDiscountValue,
          minimumSpend: nextMinimumSpend,
          startsAt: nextStartsAt,
          endsAt: nextEndsAt,
        }),
      });

      const data = (await response.json()) as { message?: string; campaign?: CampaignRow };
      if (!response.ok || !data.campaign) {
        throw new Error(data.message || "Kampanya güncellenemedi.");
      }

      setCampaigns((prev) => prev.map((item) => (item._id === data.campaign?._id ? (data.campaign as CampaignRow) : item)));
      setSuccessMessage("Kampanya güncellendi.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Kampanya güncellenirken hata oluştu.";
      setErrorMessage(message);
    }
  };

  return (
    <section className="space-y-6 flex flex-col gap-4">
      <div className="rounded-3xl border border-white/10 bg-slate-900/75 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-2xl sm:p-6">
        <h2 className="text-2xl font-black text-white">Kampanya Yönetimi</h2>
        <p className="mt-1 text-sm text-slate-400">Kupon ve indirim kampanyalarını yönetin.</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Toplam Kampanya</p>
            <p className="mt-2 text-2xl font-black text-white">{totalCampaigns}</p>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Aktif Kampanya</p>
            <p className="mt-2 text-2xl font-black text-cyan-200">{activeCampaigns}</p>
          </article>
        </div>
      </div>

      <article className="rounded-3xl border border-white/10 bg-slate-900/75 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-2xl sm:p-6">
        <h3 className="text-xl font-black text-white">Yeni Kampanya</h3>

        <form onSubmit={handleCreateCampaign} className="mt-4 grid gap-4 md:grid-cols-2">
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Kampanya başlığı"
            required
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:border-cyan-400/70"
          />

          <input
            type="text"
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            placeholder="Kampanya kodu"
            required
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:border-cyan-400/70"
          />

          <select
            value={discountType}
            onChange={(event) => setDiscountType(event.target.value as "percent" | "fixed")}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-400/70"
          >
            <option value="percent" className="bg-slate-900">Yüzde İndirim</option>
            <option value="fixed" className="bg-slate-900">Sabit Tutar</option>
          </select>

          <input
            type="number"
            min="0"
            value={discountValue}
            onChange={(event) => setDiscountValue(event.target.value)}
            placeholder="İndirim değeri"
            required
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:border-cyan-400/70"
          />

          <input
            type="number"
            min="0"
            value={minimumSpend}
            onChange={(event) => setMinimumSpend(event.target.value)}
            placeholder="Minimum harcama"
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:border-cyan-400/70"
          />

          <label className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
            <input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} />
            Aktif kampanya
          </label>

          <input
            type="datetime-local"
            value={startsAt}
            onChange={(event) => setStartsAt(event.target.value)}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-400/70"
          />

          <input
            type="datetime-local"
            value={endsAt}
            onChange={(event) => setEndsAt(event.target.value)}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-400/70"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="md:col-span-2 rounded-2xl border border-cyan-300/30 bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Oluşturuluyor..." : "Kampanya Oluştur"}
          </button>
        </form>
      </article>

      <div className="overflow-x-auto rounded-3xl border border-white/10 bg-slate-900/75 p-4 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-2xl sm:p-6">
        {errorMessage && <p className="mb-3 text-sm text-rose-300">{errorMessage}</p>}
        {successMessage && <p className="mb-3 text-sm text-emerald-300">{successMessage}</p>}

        <table className="min-w-full border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Kampanya</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">İndirim</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Min. Harcama</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Tarih Aralığı</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Durum</th>
              <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-3 py-4 text-sm text-slate-300">Kampanyalar yükleniyor...</td>
              </tr>
            ) : campaigns.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-4 text-sm text-slate-300">Kayıtlı kampanya bulunamadı.</td>
              </tr>
            ) : (
              campaigns.map((campaign) => (
                <tr key={campaign._id} className="rounded-xl border border-white/10 bg-white/5">
                  <td className="rounded-l-xl px-3 py-3 text-sm text-white">
                    <p className="font-semibold">{campaign.title}</p>
                    <p className="text-xs text-cyan-200">{campaign.code}</p>
                  </td>
                  <td className="px-3 py-3 text-sm text-slate-200">
                    {campaign.discountType === "percent" ? `%${campaign.discountValue}` : formatCurrency(campaign.discountValue)}
                  </td>
                  <td className="px-3 py-3 text-sm text-slate-200">{formatCurrency(campaign.minimumSpend || 0)}</td>
                  <td className="px-3 py-3 text-sm text-slate-300">
                    <p>{formatDateTime(campaign.startsAt)}</p>
                    <p>{formatDateTime(campaign.endsAt)}</p>
                  </td>
                  <td className="px-3 py-3 text-sm">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                        campaign.isActive
                          ? "border-emerald-300/30 bg-emerald-500/10 text-emerald-200"
                          : "border-slate-300/20 bg-white/5 text-slate-300"
                      }`}
                    >
                      {campaign.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td className="rounded-r-xl px-3 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(campaign)}
                        className="rounded-lg border border-cyan-300/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-100"
                      >
                        {campaign.isActive ? "Pasif Yap" : "Aktif Yap"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEditCampaign(campaign)}
                        className="rounded-lg border border-amber-300/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-200"
                      >
                        Düzenle
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCampaign(campaign._id)}
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
