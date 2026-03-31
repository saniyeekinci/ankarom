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
    if (!token) return;

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
    if (!token) return;

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Onaylandı":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Reddedildi":
        return "bg-rose-100 text-rose-700 border-rose-200";
      default:
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  return (
    <section className="flex flex-col gap-6">
      {/* Sayfa Başlığı */}
      <header className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Bayi Başvuruları</h2>
        <p className="mt-1 text-sm text-slate-500">Bayi adaylarını değerlendirip ağınıza yeni iş ortakları ekleyin.</p>
      </header>

      {errorMessage && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700">
          {errorMessage}
        </div>
      )}

      {/* Filtreleme ve Arama Paneli */}
      <div className="flex flex-col sm:flex-row gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
  <input
    type="text"
    value={searchQuery}
    onChange={(event) => setSearchQuery(event.target.value)}
    placeholder="Başvuru no, firma, şehir veya yetkili..."
    className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
  />
  <select
    value={statusFilter}
    onChange={(event) => setStatusFilter(event.target.value as "all" | "Beklemede" | "Onaylandı" | "Reddedildi")}
    className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none transition-colors min-w-40"
  >
    <option value="all">Tüm Durumlar</option>
    <option value="Beklemede">Beklemede</option>
    <option value="Onaylandı">Onaylandı</option>
    <option value="Reddedildi">Reddedildi</option>
  </select>
  <select
    value={sortOrder}
    onChange={(event) => setSortOrder(event.target.value as "newest" | "oldest")}
    className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none transition-colors min-w-40"
  >
    <option value="newest">En Yeni Başvuru</option>
    <option value="oldest">En Eski Başvuru</option>
  </select>
</div>

      {/* Başvuru Tablosu */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">No / Tarih</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Firma Adı</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Şehir</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Yetkili Kişi</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">Başvurular yükleniyor...</td>
                </tr>
              ) : filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">Kriterlere uygun başvuru bulunamadı.</td>
                </tr>
              ) : (
                filteredApplications.map((row) => (
                  <tr key={row._id} className="transition-colors hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-bold text-slate-900">{row.applicationNo}</p>
                      <p className="text-xs text-slate-400">
                        {row.createdAt ? new Date(row.createdAt).toLocaleDateString("tr-TR") : "-"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{row.companyName}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{row.city}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{row.contactName}</td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateStatus(row._id, "Onaylandı")}
                            disabled={row.status === "Onaylandı"}
                            className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 border border-emerald-200 hover:bg-emerald-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            Onayla
                          </button>
                          <button
                            type="button"
                            onClick={() => updateStatus(row._id, "Reddedildi")}
                            disabled={row.status === "Reddedildi"}
                            className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 border border-rose-200 hover:bg-rose-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            Reddet
                          </button>
                        </div>
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-tighter ${getStatusBadge(row.status)}`}>
                          {row.status}
                        </span>
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