"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

type AdminUserRow = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export default function AdminCustomersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const totalUsers = useMemo(() => users.length, [users]);
  const totalAdmins = useMemo(() => users.filter((user) => user.role === "admin").length, [users]);

  const fetchUsers = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = (await response.json()) as AdminUserRow[] & { message?: string };

      if (!response.ok) {
        throw new Error((data as { message?: string }).message || "Müşteri listesi getirilemedi.");
      }

      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <section className="flex flex-col gap-6">
      {/* Üst Başlık ve İstatistik Özetleri */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Müşteri Yönetimi</h2>
          <p className="mt-1 text-sm text-slate-500">Sistemde kayıtlı kullanıcıları ve yetki seviyelerini görüntüleyin.</p>
        </div>
        
        <div className="flex gap-3">
          <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-2 text-sm">
            <span className="text-slate-500">Toplam Kullanıcı:</span> 
            <span className="ml-2 font-bold text-slate-900">{totalUsers}</span>
          </div>
          <div className="rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm">
            <span className="text-indigo-600">Yönetici:</span> 
            <span className="ml-2 font-bold text-indigo-700">{totalAdmins}</span>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700">
          {errorMessage}
        </div>
      )}

      {/* Kullanıcı Tablosu */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Ad Soyad</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">E-posta Adresi</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Yetki Rolü</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Kayıt Tarihi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-500">
                    Kullanıcı verileri yükleniyor...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-500">
                    Sistemde henüz kayıtlı kullanıcı bulunmuyor.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="transition-colors hover:bg-slate-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-slate-900">
                      {user.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                      {user.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          user.role === "admin"
                            ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 font-medium">
                      {formatDate(user.createdAt)}
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