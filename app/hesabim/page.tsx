"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardDocumentListIcon, ShoppingCartIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon, ArrowLeftIcon, HeartIcon, LifebuoyIcon, BellIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/components/auth/AuthProvider";
import { useCart } from "@/components/cart/CartProvider";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const recentOrders = [
  { id: "ANK-2026-1042", date: "22 Mart 2026", status: "Hazırlanıyor", amount: "₺2.450.000" },
  { id: "ANK-2026-0978", date: "14 Mart 2026", status: "Kargoda", amount: "₺1.180.000" },
  { id: "ANK-2026-0911", date: "06 Mart 2026", status: "Teslim Edildi", amount: "₺890.000" },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);

type UserSupportTicket = {
  _id: string;
  ticketNo: string;
  subject: string;
  message?: string;
  adminReply?: string;
  status: "Açık" | "Yanıtlandı";
  createdAt?: string;
  answeredAt?: string;
};

type UserNotification = {
  _id: string;
  title: string;
  message: string;
  type?: "general" | "support_reply";
  createdAt?: string;
  isRead?: boolean;
};

const formatNotificationDate = (value?: string) => {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const sanitizeReplyPreview = (value?: string) => {
  if (!value) {
    return "";
  }

  let normalized = String(value).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const inlineCutPatterns = [/\bOn\b.+\bwrote:\s*/i, /\btarihinde\b.+\byazd[ıi1]:\s*/i, /Ankarom\s+Destek\s*<[^>]+>/i];

  let cutIndex = normalized.length;
  for (const pattern of inlineCutPatterns) {
    const match = pattern.exec(normalized);
    if (match && typeof match.index === "number" && match.index < cutIndex) {
      cutIndex = match.index;
    }
  }

  if (cutIndex < normalized.length) {
    normalized = normalized.slice(0, cutIndex);
  }

  const lines = normalized.split("\n");
  const stopPatterns = [/^On\s.+wrote:\s*$/i, /^.+tarihinde\s+şunu\s+yazdı:\s*$/i, /^>+\s*/];
  const cleanLines = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (stopPatterns.some((pattern) => pattern.test(trimmed))) {
      break;
    }
    cleanLines.push(line);
  }

  return cleanLines.join("\n").trim();
};

const getNotificationMeta = (notification: UserNotification) => {
  if (notification.type === "support_reply") {
    return {
      tag: "Destek Yanıtı",
      tagClass: "border-emerald-400/40 bg-emerald-500/15 text-emerald-200",
      iconClass: "text-emerald-300",
      titleClass: "text-emerald-100",
    };
  }

  return {
    tag: "Bildirim",
    tagClass: "border-cyan-400/40 bg-cyan-500/15 text-cyan-200",
    iconClass: "text-cyan-300",
    titleClass: "text-white",
  };
};

export default function AccountPage() {
  const router = useRouter();
  const supportPanelRef = useRef<HTMLDivElement | null>(null);
  const notificationPanelRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [supportMessage, setSupportMessage] = useState("");
  const [isSendingSupport, setIsSendingSupport] = useState(false);
  const [supportFeedback, setSupportFeedback] = useState("");
  const [supportTickets, setSupportTickets] = useState<UserSupportTicket[]>([]);
  const [isSupportLoading, setIsSupportLoading] = useState(false);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(false);
  const [notificationFeedback, setNotificationFeedback] = useState("");
  const { user, token, isAuthenticated, logout } = useAuth();
  const { items, itemCount, subtotal } = useCart();

  const fetchSupportTickets = useCallback(async (silent = false) => {
    if (!token) {
      return;
    }

    if (!silent) {
      setIsSupportLoading(true);
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/my-support-tickets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = (await response.json()) as UserSupportTicket[] & { message?: string };
      if (!response.ok) {
        throw new Error((data as { message?: string }).message || "Destek mesajları alınamadı.");
      }

      setSupportTickets(Array.isArray(data) ? data : []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Destek mesajları yüklenemedi.";
      setSupportFeedback(message);
    } finally {
      if (!silent) {
        setIsSupportLoading(false);
      }
    }
  }, [token]);

  const handleSendSupportMessage = async () => {
    if (!user) {
      setSupportFeedback("Destek talebi göndermek için giriş yapmalısınız.");
      return;
    }

    const normalizedMessage = supportMessage.trim();

    if (!normalizedMessage) {
      setSupportFeedback("Lütfen önce mesajınızı yazın.");
      return;
    }

    setIsSendingSupport(true);
    setSupportFeedback("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/public/support-tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: user.name,
          customerEmail: user.email,
          subject: "Hesabım destek talebi",
          priority: "Orta",
          message: normalizedMessage,
        }),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message || "Destek talebi gönderilemedi.");
      }

      setSupportMessage("");
      setSupportFeedback(data.message || "Talebiniz başarıyla gönderildi.");
      await fetchSupportTickets();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Destek talebi gönderilirken hata oluştu.";
      setSupportFeedback(message);
    } finally {
      setIsSendingSupport(false);
    }
  };

  const fetchNotifications = useCallback(async (silent = false) => {
    if (!token) {
      return;
    }

    if (!silent) {
      setIsNotificationsLoading(true);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = (await response.json()) as {
        notifications?: UserNotification[];
        unreadCount?: number;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(data.message || "Bildirimler alınamadı.");
      }

      setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
      setUnreadCount(typeof data.unreadCount === "number" ? data.unreadCount : 0);
      setNotificationFeedback("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Bildirimler yüklenemedi.";
      setNotificationFeedback(message);
    } finally {
      if (!silent) {
        setIsNotificationsLoading(false);
      }
    }
  }, [token]);

  const markAllNotificationsAsRead = useCallback(async () => {
    if (!token) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/notifications/read-all`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return;
      }

      setUnreadCount(0);
      setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
    } catch {
    }
  }, [token]);

  // Yeni kayıt eklendiğinde sadece destek kutusunun kendi içinde en alta kaydır
  useEffect(() => {
    if (isSupportOpen) {
      const container = messagesContainerRef.current;
      if (container) {
        container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
      }
    }
  }, [supportTickets.length, isSupportOpen]);

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      router.replace("/admin/urun-ekle");
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    if (isSupportOpen) {
      fetchSupportTickets();
    }
  }, [isSupportOpen, fetchSupportTickets]);

  useEffect(() => {
    if (!token) {
      return;
    }

    fetchNotifications();
  }, [token, fetchNotifications]);

  useEffect(() => {
    if (!isNotificationsOpen) {
      return;
    }

    fetchNotifications(true);
    if (unreadCount > 0) {
      markAllNotificationsAsRead();
    }
  }, [isNotificationsOpen, unreadCount, fetchNotifications, markAllNotificationsAsRead]);

  useEffect(() => {
    if (!isSupportOpen || !token) {
      return;
    }

    const intervalId = setInterval(() => {
      fetchSupportTickets(true);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [isSupportOpen, token, fetchSupportTickets]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const intervalId = setInterval(() => {
      fetchNotifications(true);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [token, fetchNotifications]);

  useEffect(() => {
    if (!isSupportOpen && !isNotificationsOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (supportPanelRef.current && !supportPanelRef.current.contains(target)) {
        setIsSupportOpen(false);
      }
      if (notificationPanelRef.current && !notificationPanelRef.current.contains(target)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSupportOpen, isNotificationsOpen]);

  if (!isAuthenticated || !user) {
    return (
      <section className="relative flex min-h-[calc(100vh-180px)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900/80 p-8 text-center shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-2xl">
          <h1 className="text-3xl font-black text-white">Hesabım</h1>
          <p className="mt-3 text-sm text-slate-300">Bu sayfayı görüntülemek için önce giriş yapman gerekiyor.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link href="/giris" className="rounded-xl bg-linear-to-r from-indigo-500 to-cyan-500 px-5 py-3 text-sm font-bold text-white">
              Giriş Yap
            </Link>
            <Link href="/kayit" className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white">
              Kayıt Ol
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden px-4 py-12 sm:px-6 lg:px-8 lg:py-16  ">
      <div className="pointer-events-none absolute -left-20 top-8 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="flex flex-col gap-4 relative mx-auto w-full max-w-360">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
          <div className="lg:flex-1">
            <h1 className="text-3xl font-black text-white sm:text-4xl lg:text-5xl">
              Hoş geldin, <span className="bg-linear-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent">{user.name}</span>
            </h1>
            <p className="mt-3 text-sm text-slate-300 sm:text-base">Premium otomotiv panelinden siparişlerini, sepetini ve hesap ayarlarını yönetebilirsin.</p>
          </div>
          <div ref={notificationPanelRef} className="relative self-start">
            <button
              type="button"
              onClick={() => setIsNotificationsOpen((prev) => !prev)}
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-slate-900/80 text-white transition-colors hover:bg-slate-800"
              aria-label="Bildirimler"
            >
              <BellIcon className="h-5 w-5 text-cyan-300" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 min-w-4.5 rounded-full bg-rose-500 px-1.5 py-0.5 text-center text-[10px] font-bold leading-none text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 z-60 mt-2 w-[320px] max-w-[90vw] rounded-2xl border border-white/10 bg-slate-950/95 p-3 shadow-[0_20px_50px_rgba(2,6,23,0.8)] backdrop-blur-xl">
                <div className="mb-2 flex items-center justify-between border-b border-white/10 pb-2">
                  <h3 className="text-sm font-bold text-white">Bildirimler</h3>
                  <button
                    type="button"
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] font-semibold text-cyan-300 hover:text-cyan-200"
                  >
                    Tümünü okundu yap
                  </button>
                </div>

                <div className="support-chat-scroll max-h-80 space-y-2 overflow-y-auto pr-1">
                  {isNotificationsLoading && notifications.length === 0 ? (
                    <p className="py-6 text-center text-xs text-slate-400">Bildirimler yükleniyor...</p>
                  ) : notifications.length === 0 ? (
                    <p className="py-6 text-center text-xs text-slate-400">Yeni bildirimin yok.</p>
                  ) : (
                    notifications.map((notification) => {
                      const meta = getNotificationMeta(notification);

                      return (
                        <div
                          key={notification._id}
                          className={`rounded-xl border px-3 py-2 ${notification.isRead ? "border-white/10 bg-white/5" : "border-cyan-500/30 bg-cyan-500/10"}`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${meta.tagClass}`}>
                              <ChatBubbleLeftRightIcon className={`h-3 w-3 ${meta.iconClass}`} />
                              {meta.tag}
                            </span>
                            {!notification.isRead && <span className="h-2 w-2 rounded-full bg-cyan-300" />}
                          </div>
                          <p className={`mt-2 text-xs font-semibold ${meta.titleClass}`}>{notification.title}</p>
                          <p className="mt-1 text-xs text-slate-300">{notification.message}</p>
                          <p className="mt-2 text-[11px] text-slate-500">{formatNotificationDate(notification.createdAt)}</p>
                        </div>
                      );
                    })
                  )}
                </div>

                {notificationFeedback && (
                  <p className="mt-2 text-center text-[11px] font-medium text-rose-200">{notificationFeedback}</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <aside className="lg:col-span-3 rounded-3xl border border-white/10 bg-slate-900/75 p-4 shadow-[0_20px_60px_rgba(2,6,23,0.55)] backdrop-blur-2xl">
            <nav className="space-y-2 ">
              <div className="space-y-1">
                <button type="button" className="flex w-full items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 text-left text-sm font-semibold text-white">
                  <ClipboardDocumentListIcon className="h-5 w-5 text-cyan-300" />
                  Siparişlerim
                </button>
                <Link href="/hesabim/favorilerim" className="ml-7 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white">
                  <HeartIcon className="h-4 w-4 text-cyan-300" />
                  Favorilerim
                </Link>
              </div>
              <Link href="/sepetlerim" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/85 transition-colors hover:bg-white/10 hover:text-white">
                <ShoppingCartIcon className="h-5 w-5 text-cyan-300" />
                Sepetim
              </Link>
              {user.role === "admin" && (
                <Link href="/admin/urun-ekle" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-cyan-200 transition-colors hover:bg-cyan-500/15 hover:text-cyan-100">
                  <Cog6ToothIcon className="h-5 w-5 text-cyan-300" />
                  Admin Paneli
                </Link>
              )}
              <Link href="/hesabim/ayarlar" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/85 transition-colors hover:bg-white/10 hover:text-white">
                <Cog6ToothIcon className="h-5 w-5 text-cyan-300" />
                Hesap Ayarları
              </Link>
              <button
                type="button"
                onClick={() => setIsSupportOpen((prev) => !prev)}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/85 transition-colors hover:bg-white/10 hover:text-white"
              >
                <LifebuoyIcon className="h-5 w-5 text-cyan-300" />
                Destek Al
              </button>
              <button
                type="button"
                onClick={logout}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-rose-300/25 bg-rose-500/10 px-3 py-2.5 text-sm font-semibold text-rose-200"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                Çıkış Yap
              </button>
            </nav>
          </aside>

          <div className="relative flex flex-col gap-4 lg:col-span-9 space-y-6">
            {isSupportOpen && (
              <div className="w-full lg:absolute lg:right-6 lg:top-0 lg:z-50 lg:flex lg:justify-end">
                <div ref={supportPanelRef} className="z-50 w-full rounded-3xl border border-white/10 bg-slate-950/95 p-5 shadow-[0_20px_50px_rgba(2,6,23,0.8)] backdrop-blur-xl lg:w-117.5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                        </span>
                        Canlı Destek
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Mesajlar otomatik yenilenir</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsSupportOpen(false)}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      Kapat
                    </button>
                  </div>

                  <div ref={messagesContainerRef} className="support-chat-scroll mt-4 h-72 overflow-y-auto rounded-2xl border border-white/5 bg-slate-900/40 p-4">
                    {isSupportLoading && supportTickets.length === 0 ? (
                      <div className="flex h-full items-center justify-center">
                        <p className="text-sm font-medium text-slate-400 animate-pulse">Mesajlar yükleniyor...</p>
                      </div>
                    ) : supportTickets.length === 0 ? (
                      <div className="flex h-full flex-col items-center justify-center text-center">
                        <LifebuoyIcon className="h-8 w-8 text-slate-600 mb-2" />
                        <p className="text-sm text-slate-400">Destek ekibine ilk mesajını gönder.<br />Konuşma akışı burada görünecek.</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-5">
                        {/* reverse() fonksiyonu eklenerek dizi tersine çevrildi, en yeni mesaj en altta çıkacak */}
                        {[...supportTickets].reverse().map((ticket) => {
                          const cleanedAdminReply = sanitizeReplyPreview(ticket.adminReply);

                          return (
                          <div key={ticket._id} className="flex flex-col gap-2">
                            {/* Kullanıcı Mesajı */}
                            <div className="flex flex-col items-end w-full">
                              <span className="mb-1 text-[10px] font-medium tracking-wider text-slate-500 uppercase">
                                {ticket.ticketNo} - Sen
                              </span>
                              <div className="max-w-[85%] rounded-2xl rounded-br-sm border border-cyan-500/20 bg-cyan-500/10 px-4 py-2.5 text-sm text-white shadow-sm">
                                {ticket.message || "-"}
                              </div>
                            </div>

                            {/* Destek Ekibi Yanıtı */}
                            {cleanedAdminReply ? (
                              <div className="flex flex-col items-start w-full mt-1">
                                <span className="mb-1 text-[10px] font-medium tracking-wider text-slate-500 uppercase">
                                  Destek Ekibi
                                </span>
                                <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-sm text-white shadow-sm">
                                  {cleanedAdminReply}
                                </div>
                              </div>
                            ) : ticket.status === "Yanıtlandı" ? (
                              <div className="flex flex-col items-start w-full mt-1">
                                <span className="mb-1 text-[10px] font-medium tracking-wider text-slate-500 uppercase">
                                  Destek Ekibi
                                </span>
                                <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-100">
                                  Bu talep e-posta üzerinden yanıtlandı. Gelen kutunu kontrol edebilirsin.
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col items-start w-full mt-1">
                                <span className="mb-1 text-[10px] font-medium tracking-wider text-slate-500 uppercase">
                                  Sistem
                                </span>
                                <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-white/5 bg-white/5 px-4 py-2 text-xs text-slate-400 italic">
                                  Yanıt bekleniyor...
                                </div>
                              </div>
                            )}
                          </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <input
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendSupportMessage()}
                      placeholder="Mesajınızı yazın..."
                      className="h-12 flex-1 rounded-xl border border-white/10 bg-slate-900/80 px-4 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:bg-white/5 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    />
                    <button
                      type="button"
                      onClick={handleSendSupportMessage}
                      disabled={isSendingSupport || !supportMessage.trim()}
                      className="h-12 rounded-xl bg-linear-to-r from-cyan-600 to-indigo-600 px-6 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 hover:shadow-cyan-500/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {isSendingSupport ? "..." : "Gönder"}
                    </button>
                  </div>

                  {supportFeedback && (
                    <p className="mt-3 text-center text-xs font-medium text-cyan-200">{supportFeedback}</p>
                  )}
                </div>
              </div>
            )}

            <article className="relative z-10 rounded-3xl border border-white/10 bg-linear-to-b from-slate-900/80 to-slate-950/85 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-xl">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-white">Aktif Sepet Durumu</h2>
                <Link href="/sepetlerim" className="text-sm font-semibold text-cyan-300 hover:text-cyan-200">
                  Sepete Git
                </Link>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Ürün Adedi</p>
                  <p className="mt-2 text-2xl font-black text-white">{itemCount}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Sepet Toplamı</p>
                  <p className="mt-2 text-2xl font-black text-yellow-300">{formatCurrency(subtotal)}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Son Eklenen</p>
                  <p className="mt-2 text-sm font-semibold text-white line-clamp-2">{items[items.length - 1]?.name || "Henüz ürün yok"}</p>
                </div>
              </div>
            </article>

            <article className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-linear-to-b from-slate-900/80 to-slate-950/85 p-5 shadow-[0_24px_70px_rgba(2,6,23,0.6)] backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-white">Son Siparişlerim</h2>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  Geri
                </button>
              </div>
              <div className="flex flex-col gap-4 mt-4 space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">{order.id}</p>
                      <p className="mt-1 text-xs text-slate-400">{order.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full border border-cyan-300/30 bg-cyan-500/10 px-2.5 py-1 text-xs font-semibold text-cyan-200">
                        {order.status}
                      </span>
                      <span className="text-sm font-bold text-yellow-300">{order.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}