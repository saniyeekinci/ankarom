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
  const activeCount = useMemo(() => campaigns.filter((c) => c.isActive).length, [campaigns]);

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
          code: code.toUpperCase(),
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
          code: nextCode.toUpperCase(),
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
    <section className="flex flex-col gap-6">
      {/* Üst Başlık ve Özet */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Kampanya Yönetimi</h2>
        <p className="mt-1 text-sm text-slate-500">Özel kuponlar ve dönemsel indirim kampanyalarını buradan yönetin.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <article className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Toplam Kampanya</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{totalCampaigns}</p>
          </article>
          <article className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Aktif Kampanya</p>
            <p className="mt-1 text-2xl font-bold text-indigo-700">{activeCount}</p>
          </article>
        </div>
      </div>

      {/* Yeni Kampanya Formu */}
      <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-5">Yeni Kampanya Tanımla</h3>

        <form onSubmit={handleCreateCampaign} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Kampanya Başlığı</label>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Örn: Bahar Fırsatları"
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Kampanya Kodu</label>
            <input
              type="text"
              value={code}
              onChange={(event) => setCode(event.target.value.toUpperCase())}
              placeholder="Örn: BAHAR25"
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">İndirim Tipi</label>
            <select
              value={discountType}
              onChange={(event) => setDiscountType(event.target.value as "percent" | "fixed")}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none transition-colors"
            >
              <option value="percent">Yüzde İndirim (%)</option>
              <option value="fixed">Sabit Tutar (₺)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">İndirim Değeri</label>
            <input
              type="number"
              min="0"
              value={discountValue}
              onChange={(event) => setDiscountValue(event.target.value)}
              placeholder="Örn: 20"
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Minimum Harcama (₺)</label>
            <input
              type="number"
              min="0"
              value={minimumSpend}
              onChange={(event) => setMinimumSpend(event.target.value)}
              placeholder="0"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-3 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 cursor-pointer">
              <input 
                type="checkbox" 
                checked={isActive} 
                onChange={(event) => setIsActive(event.target.checked)} 
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Hemen yayına al
            </label>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Başlangıç Tarihi</label>
            <input
              type="datetime-local"
              value={startsAt}
              onChange={(event) => setStartsAt(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Bitiş Tarihi</label>
            <input
              type="datetime-local"
              value={endsAt}
              onChange={(event) => setEndsAt(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="md:col-span-2 mt-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSubmitting ? "Kaydediliyor..." : "Kampanyayı Kaydet"}
          </button>
        </form>
      </article>

      {/* Liste Tablosu */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          {errorMessage && <p className="text-sm font-medium text-rose-600">{errorMessage}</p>}
          {successMessage && <p className="text-sm font-medium text-emerald-600">{successMessage}</p>}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Kampanya Bilgisi</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">İndirim</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Min. Harcama</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Geçerlilik Tarihi</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Durum</th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">Yükleniyor...</td></tr>
              ) : campaigns.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">Kayıtlı kampanya bulunamadı.</td></tr>
              ) : (
                campaigns.map((campaign) => (
                  <tr key={campaign._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">{campaign.title}</p>
                      <p className="text-xs font-bold text-indigo-600 tracking-wider uppercase">{campaign.code}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      {campaign.discountType === "percent" ? `%${campaign.discountValue}` : formatCurrency(campaign.discountValue)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatCurrency(campaign.minimumSpend || 0)}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 leading-relaxed">
                      <p><span className="font-semibold">Bşl:</span> {formatDateTime(campaign.startsAt)}</p>
                      <p><span className="font-semibold">Bitiş:</span> {formatDateTime(campaign.endsAt)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                          campaign.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}
                      >
                        {campaign.isActive ? "AKTİF" : "PASİF"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(campaign)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-bold border transition-colors ${
                            campaign.isActive 
                            ? "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100" 
                            : "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
                          }`}
                        >
                          {campaign.isActive ? "Durdur" : "Başlat"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditCampaign(campaign)}
                          className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 border border-indigo-100 hover:bg-indigo-100"
                        >
                          Düzenle
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCampaign(campaign._id)}
                          className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 border border-rose-100 hover:bg-rose-100"
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