"use client";

import { useCallback, useEffect, useState } from "react";
import { useMemo } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

type SupportTicket = {
  _id: string;
  ticketNo: string;
  subject: string;
  customer: string;
  customerEmail?: string;
  message?: string;
  adminReply?: string;
  messages?: Array<{
    sender: "customer" | "admin" | "system";
    text: string;
    createdAt?: string;
  }>;
  answeredAt?: string;
  priority: "Düşük" | "Orta" | "Yüksek";
  status: "Açık" | "Yanıtlandı";
  createdAt?: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminSupportPage() {
  const { token } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "answered">("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const getLatestMessageText = (ticket: SupportTicket) => {
    if (Array.isArray(ticket.messages) && ticket.messages.length > 0) {
      const latest = [...ticket.messages]
        .filter((entry) => entry && String(entry.text || "").trim())
        .sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime())
        .at(-1);

      if (latest?.text) {
        return latest.text;
      }
    }

    return ticket.adminReply || ticket.message || "";
  };

  const filteredTickets = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase("tr-TR");

    return tickets
      .filter((ticket) => {
        if (statusFilter === "open" && ticket.status !== "Açık") {
          return false;
        }

        if (statusFilter === "answered" && ticket.status !== "Yanıtlandı") {
          return false;
        }

        if (!query) {
          return true;
        }

        return `${ticket.ticketNo} ${ticket.customer} ${ticket.customerEmail || ""} ${ticket.subject} ${getLatestMessageText(ticket)}`
          .toLocaleLowerCase("tr-TR")
          .includes(query);
      })
      .sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return sortOrder === "newest" ? bTime - aTime : aTime - bTime;
      });
  }, [tickets, searchQuery, statusFilter, sortOrder]);

  const fetchTickets = useCallback(async (silent = false) => {
    if (!token) {
      return;
    }

    if (!silent) {
      setIsLoading(true);
      setErrorMessage("");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/support-tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = (await response.json()) as SupportTicket[] & { message?: string };
      if (!response.ok) {
        throw new Error((data as { message?: string }).message || "Destek talepleri getirilemedi.");
      }

      setTickets(Array.isArray(data) ? data : []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Destek talepleri yüklenirken hata oluştu.";
      setErrorMessage(message);
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  }, [token]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const intervalId = setInterval(() => {
      fetchTickets(true);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [token, fetchTickets]);

  const markAnswered = async (id: string) => {
    if (!token) {
      return;
    }

    const replyMessage = window.prompt("Yanıt metnini yazın (mailden cevapladıysan boş bırakıp TAMAM deyin):", "");
    if (replyMessage === null) {
      return;
    }

    setErrorMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/support-tickets/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "Yanıtlandı",
          ...(replyMessage.trim() ? { replyMessage: replyMessage.trim() } : {}),
        }),
      });

      const data = (await response.json()) as { message?: string; ticket?: SupportTicket };
      if (!response.ok || !data.ticket) {
        throw new Error(data.message || "Talep durumu güncellenemedi.");
      }

      setTickets((prev) => prev.map((ticket) => (ticket._id === data.ticket?._id ? (data.ticket as SupportTicket) : ticket)));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Durum güncellenirken hata oluştu.";
      setErrorMessage(message);
    }
  };

  return (
    <section className="space-y-6 flex flex-col gap-4">
      <div className="rounded-3xl border border-white/10 bg-slate-900/75 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-2xl sm:p-6">
        <h2 className="text-2xl font-black text-white">Destek Talepleri</h2>
        <p className="mt-1 text-sm text-slate-400">Müşteri destek taleplerini yönetip hızlıca yanıtlayın.</p>
      </div>

      {errorMessage && <p className="text-sm text-rose-300">{errorMessage}</p>}

      <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 md:grid-cols-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Talep no, müşteri veya konu ara"
          className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 outline-none focus:border-cyan-400/70"
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as "all" | "open" | "answered")}
          className="rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400/70"
        >
          <option value="all" className="bg-slate-900">Tüm Durumlar</option>
          <option value="open" className="bg-slate-900">Açık</option>
          <option value="answered" className="bg-slate-900">Yanıtlandı</option>
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
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Talep No</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Konu</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Müşteri</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Mesaj</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Öncelik</th>
              <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Durum</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-3 py-4 text-sm text-slate-300">Destek talepleri yükleniyor...</td>
              </tr>
            ) : filteredTickets.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-4 text-sm text-slate-300">Filtreye uygun destek talebi yok.</td>
              </tr>
            ) : filteredTickets.map((ticket) => (
              <tr key={ticket._id} className="rounded-xl border border-white/10 bg-white/5">
                <td className="rounded-l-xl px-3 py-3 text-sm font-semibold text-white">{ticket.ticketNo}</td>
                <td className="px-3 py-3 text-sm text-slate-200">{ticket.subject}</td>
                <td className="px-3 py-3 text-sm text-slate-200">
                  <p>{ticket.customer}</p>
                  {ticket.customerEmail && <p className="text-xs text-slate-400">{ticket.customerEmail}</p>}
                </td>
                <td className="px-3 py-3 text-sm text-slate-200 max-w-80 truncate" title={getLatestMessageText(ticket) || ""}>{getLatestMessageText(ticket) || "-"}</td>
                <td className="px-3 py-3 text-sm text-amber-200">{ticket.priority}</td>
                <td className="rounded-r-xl px-3 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => markAnswered(ticket._id)}
                    disabled={ticket.status === "Yanıtlandı"}
                    className="rounded-lg border border-cyan-300/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {ticket.status === "Yanıtlandı" ? "Yanıtlandı" : "Yanıtla"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
