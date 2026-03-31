"use client";

import { useCallback, useEffect, useState } from "react";
import { useMemo } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import FAQSection from "@/components/FAQSection";

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

  // Öncelik durumuna göre renk belirleme yardımcısı
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Yüksek":
        return "text-rose-600 bg-rose-50";
      case "Orta":
        return "text-amber-600 bg-amber-50";
      case "Düşük":
      default:
        return "text-emerald-600 bg-emerald-50";
    }
  };

  return (
    <section className="flex flex-col gap-6">
      
      {/* Sıkça Sorulan Sorular */}
      <FAQSection />
      
      {/* Sayfa Başlığı */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Destek Talepleri</h2>
        <p className="mt-1 text-sm text-slate-500">Müşteri destek taleplerini yönetip hızlıca yanıtlayın.</p>
      </div>

      {/* Hata Mesajı */}
      {errorMessage && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700">
          {errorMessage}
        </div>
      )}

      {/* Filtreleme ve Arama */}
      <div className="flex flex-col sm:flex-row gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Talep no, müşteri veya konu ara"
          className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as "all" | "open" | "answered")}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors min-w-[150px]"
        >
          <option value="all">Tüm Durumlar</option>
          <option value="open">Açık</option>
          <option value="answered">Yanıtlandı</option>
        </select>
        <select
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value as "newest" | "oldest")}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors min-w-[150px]"
        >
          <option value="newest">En Yeni</option>
          <option value="oldest">En Eski</option>
        </select>
      </div>

      {/* Tablo */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Talep No</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Konu</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Müşteri</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Mesaj</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Öncelik</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">Destek talepleri yükleniyor...</td>
                </tr>
              ) : filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">Filtreye uygun destek talebi bulunamadı.</td>
                </tr>
              ) : filteredTickets.map((ticket) => (
                <tr key={ticket._id} className="transition-colors hover:bg-slate-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                    {ticket.ticketNo}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">
                    {ticket.subject}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <p className="font-medium text-slate-900">{ticket.customer}</p>
                    {ticket.customerEmail && <p className="text-xs text-slate-500">{ticket.customerEmail}</p>}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate" title={getLatestMessageText(ticket) || ""}>
                    {getLatestMessageText(ticket) || "-"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => markAnswered(ticket._id)}
                      disabled={ticket.status === "Yanıtlandı"}
                      className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                        ticket.status === "Yanıtlandı" 
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                          : "bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100"
                      }`}
                    >
                      {ticket.status === "Yanıtlandı" ? "Yanıtlandı" : "Yanıtla"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}