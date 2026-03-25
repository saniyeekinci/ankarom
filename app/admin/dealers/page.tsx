"use client";

import { useCallback, useEffect, useState } from "react";
import { useMemo } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

type DealerApplication = {
  _id: string;
  applicationNo: string;
  companyName: string;
  city: string;
  contactName: string;
  status: "Beklemede" | "Onaylandı" | "Reddedildi";
  createdAt?: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminDealersPage() {
  const { token } = useAuth();
  const [applications, setApplications] = useState<DealerApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Beklemede" | "Onaylandı" | "Reddedildi">("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const filteredApplications = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase("tr-TR");

    return applications
      .filter((row) => {
        if (statusFilter !== "all" && row.status !== statusFilter) {
          return false;
        }

        if (!query) {
          return true;
        }

        return `${row.applicationNo} ${row.companyName} ${row.city} ${row.contactName}`
          .toLocaleLowerCase("tr-TR")
          .includes(query);
      })
      .sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return sortOrder === "newest" ? bTime - aTime : aTime - bTime;
      });
  }, [applications, searchQuery, statusFilter, sortOrder]);

  const fetchApplications = useCallback(async () => {
    if (!token) {
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/dealer-applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = (await response.json()) as DealerApplication[] & { message?: string };
      if (!response.ok) {
        throw new Error((data as { message?: string }).message || "Bayi başvuruları getirilemedi.");
      }

      setApplications(Array.isArray(data) ? data : []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Bayi başvuruları yüklenirken hata oluştu.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const updateStatus = async (id: string, status: DealerApplication["status"]) => {
    if (!token) {
      return;
    }

    setErrorMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/dealer-applications/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = (await response.json()) as { message?: string; application?: DealerApplication };
      if (!response.ok || !data.application) {
        throw new Error(data.message || "Başvuru durumu güncellenemedi.");
      }

      setApplications((prev) => prev.map((row) => (row._id === data.application?._id ? (data.application as DealerApplication) : row)));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Durum güncellenirken hata oluştu.";
      setErrorMessage(message);
    }
  };

  return (
    <section className="space-y-6 flex flex-col gap-4">
      <div className="rounded-3xl border border-white/10 bg-slate-900/75 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-2xl sm:p-6">
        <h2 className="text-2xl font-black text-white">Bayi Başvuruları</h2>
        <p className="mt-1 text-sm text-slate-400">Bayi adaylarını değerlendirip durumlarını güncelleyin.</p>
      </div>

      {errorMessage && <p className="text-sm text-rose-300">{errorMessage}</p>}

      <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 md:grid-cols-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Başvuru no, firma, şehir veya yetkili ara"
          className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 outline-none focus:border-cyan-400/70"
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as "all" | "Beklemede" | "Onaylandı" | "Reddedildi")}
          className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400/70"
        >
          <option value="all" className="bg-slate-900">Tüm Durumlar</option>
          <option value="Beklemede" className="bg-slate-900">Beklemede</option>
          <option value="Onaylandı" className="bg-slate-900">Onaylandı</option>
          <option value="Reddedildi" className="bg-slate-900">Reddedildi</option>
        </select>
        <select
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value as "newest" | "oldest")}
          className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400/70"
        >
          <option value="newest" className="bg-slate-900">En Yeni</option>
          <option value="oldest" className="bg-slate-900">En Eski</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-white/10 bg-slate-900/75 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-2xl">
        <table className="min-w-full border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Başvuru No</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Firma</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Şehir</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Yetkili</th>
              <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-3 py-4 text-sm text-slate-300">Başvurular yükleniyor...</td>
              </tr>
            ) : filteredApplications.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-4 text-sm text-slate-300">Filtreye uygun bayi başvurusu yok.</td>
              </tr>
            ) : filteredApplications.map((row) => (
              <tr key={row._id} className="rounded-xl border border-white/10 bg-white/5">
                <td className="rounded-l-xl px-3 py-3 text-sm font-semibold text-white">{row.applicationNo}</td>
                <td className="px-3 py-3 text-sm text-slate-200">{row.companyName}</td>
                <td className="px-3 py-3 text-sm text-slate-200">{row.city}</td>
                <td className="px-3 py-3 text-sm text-slate-200">{row.contactName}</td>
                <td className="rounded-r-xl px-3 py-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateStatus(row._id, "Onaylandı")}
                      className="rounded-lg border border-emerald-300/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-200"
                    >
                      Onayla
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStatus(row._id, "Reddedildi")}
                      className="rounded-lg border border-rose-300/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-200"
                    >
                      Reddet
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">Durum: {row.status}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
