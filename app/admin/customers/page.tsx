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
    if (!token) {
      return;
    }

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
    <section className="rounded-3xl border border-white/10 bg-slate-900/75 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-2xl sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-white">Müşteri Yönetimi</h2>
          <p className="mt-1 text-sm text-slate-400">Sistemde kayıtlı kullanıcıları görüntüleyin.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-slate-300">
            Toplam Kullanıcı: <span className="font-semibold text-white">{totalUsers}</span>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-slate-300">
            Admin Sayısı: <span className="font-semibold text-cyan-200">{totalAdmins}</span>
          </div>
        </div>
      </div>

      {errorMessage && <p className="mt-4 text-sm text-rose-300">{errorMessage}</p>}

      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Ad Soyad</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">E-posta</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Rol</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Kayıt Tarihi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-3 py-4 text-sm text-slate-300">
                  Kullanıcılar yükleniyor...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-4 text-sm text-slate-300">
                  Kayıtlı kullanıcı bulunamadı.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="rounded-xl border border-white/10 bg-white/5">
                  <td className="rounded-l-xl px-3 py-3 text-sm font-semibold text-white">{user.name}</td>
                  <td className="px-3 py-3 text-sm text-slate-300">{user.email}</td>
                  <td className="px-3 py-3 text-sm">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        user.role === "admin"
                          ? "border border-cyan-300/30 bg-cyan-500/10 text-cyan-100"
                          : "border border-slate-300/20 bg-white/5 text-slate-200"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="rounded-r-xl px-3 py-3 text-sm text-slate-300">{formatDate(user.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
