"use client";

import { useMemo, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const cities = [
  "Adana",
  "Adıyaman",
  "Afyonkarahisar",
  "Ağrı",
  "Aksaray",
  "Amasya",
  "Ankara",
  "Antalya",
  "Ardahan",
  "Artvin",
  "Aydın",
  "Balıkesir",
  "Bartın",
  "Batman",
  "Bayburt",
  "Bilecik",
  "Bingöl",
  "Bitlis",
  "Bolu",
  "Burdur",
  "Bursa",
  "Çanakkale",
  "Çankırı",
  "Çorum",
  "Denizli",
  "Diyarbakır",
  "Düzce",
  "Edirne",
  "Elazığ",
  "Erzincan",
  "Erzurum",
  "Eskişehir",
  "Gaziantep",
  "Giresun",
  "Gümüşhane",
  "Hakkâri",
  "Hatay",
  "Iğdır",
  "Isparta",
  "İstanbul",
  "İzmir",
  "Kahramanmaraş",
  "Karabük",
  "Karaman",
  "Kars",
  "Kastamonu",
  "Kayseri",
  "Kırıkkale",
  "Kırklareli",
  "Kırşehir",
  "Kilis",
  "Kocaeli",
  "Konya",
  "Kütahya",
  "Malatya",
  "Manisa",
  "Mardin",
  "Mersin",
  "Muğla",
  "Muş",
  "Nevşehir",
  "Niğde",
  "Ordu",
  "Osmaniye",
  "Rize",
  "Sakarya",
  "Samsun",
  "Siirt",
  "Sinop",
  "Sivas",
  "Şanlıurfa",
  "Şırnak",
  "Tekirdağ",
  "Tokat",
  "Trabzon",
  "Tunceli",
  "Uşak",
  "Van",
  "Yalova",
  "Yozgat",
  "Zonguldak",
];

export default function IletisimPage() {
  const [cityQuery, setCityQuery] = useState("");
  const [isCityListOpen, setIsCityListOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [interestedProduct, setInterestedProduct] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmittingSupport, setIsSubmittingSupport] = useState(false);
  const [supportFeedback, setSupportFeedback] = useState("");

  const [dealerCompanyName, setDealerCompanyName] = useState("");
  const [dealerContactName, setDealerContactName] = useState("");
  const [dealerCity, setDealerCity] = useState("");
  const [isSubmittingDealer, setIsSubmittingDealer] = useState(false);
  const [dealerFeedback, setDealerFeedback] = useState("");

  const filteredCities = useMemo(() => {
    const query = cityQuery.trim().toLocaleLowerCase("tr-TR");

    if (!query) {
      return cities;
    }

    return cities
      .filter((city) => city.toLocaleLowerCase("tr-TR").includes(query))
      .slice(0, 12);
  }, [cityQuery]);

  const handleSupportSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSupportFeedback("");

    if (!fullName.trim() || !message.trim()) {
      setSupportFeedback("Lütfen ad soyad ve mesaj alanlarını doldurun.");
      return;
    }

    setIsSubmittingSupport(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/public/support-tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: fullName,
          subject: interestedProduct?.trim() ? `İletişim Talebi - ${interestedProduct}` : "İletişim Talebi",
          priority: "Orta",
          message: `${message} | Telefon: ${phone || "-"} | E-posta: ${email || "-"} | İl: ${cityQuery || "-"}`,
        }),
      });

      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(data.message || "Talep gönderilemedi.");
      }

      setSupportFeedback(data.message || "Talebiniz alındı.");
      setFullName("");
      setPhone("");
      setEmail("");
      setInterestedProduct("");
      setMessage("");
      setCityQuery("");
    } catch (error) {
      const text = error instanceof Error ? error.message : "Talep gönderilirken hata oluştu.";
      setSupportFeedback(text);
    } finally {
      setIsSubmittingSupport(false);
    }
  };

  const handleDealerSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setDealerFeedback("");

    if (!dealerCompanyName.trim() || !dealerContactName.trim() || !dealerCity.trim()) {
      setDealerFeedback("Lütfen bayi başvuru alanlarını eksiksiz doldurun.");
      return;
    }

    setIsSubmittingDealer(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/public/dealer-applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: dealerCompanyName,
          city: dealerCity,
          contactName: dealerContactName,
        }),
      });

      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(data.message || "Bayi başvurusu gönderilemedi.");
      }

      setDealerFeedback(data.message || "Bayi başvurunuz alındı.");
      setDealerCompanyName("");
      setDealerContactName("");
      setDealerCity("");
    } catch (error) {
      const text = error instanceof Error ? error.message : "Bayi başvurusu gönderilirken hata oluştu.";
      setDealerFeedback(text);
    } finally {
      setIsSubmittingDealer(false);
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-220px)] w-full items-center justify-center py-10 sm:py-14">
      <div className="flex w-full justify-center px-6 md:px-12">
        <div className="w-full max-w-5xl rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-10">
            <div className="flex flex-col gap-6 relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600 sm:p-7 lg:col-span-2">
              <div className=" pointer-events-none absolute -left-14 bottom-0 h-36 w-36 rounded-full bg-blue-500/10 blur-3xl" />


              <h1 className="mt-5 text-4xl font-bold leading-[1.05] text-slate-900 sm:text-5xl">
                Akıllı
                <span className="bg-linear-to-r from-blue-600 via-sky-600 to-cyan-600 bg-clip-text text-transparent"> Çözümler </span>
                
                Sizin İçin
                <br />
                Uygun mu?
              </h1>

              <p className="mt-6 text-base leading-relaxed text-slate-600">
                Operasyonunuza en uygun ürünü birlikte belirleyelim. Kısa bir ön görüşme ile ihtiyaçlarınızı analiz edip size özel teklif sunalım.
              </p>

              <div className="mt-8 border-t border-slate-200 pt-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Görüşme Süresi</p>
                    <p className="mt-1 text-xl font-semibold text-slate-900">20-30 dk</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Dönüş Süresi</p>
                    <p className="mt-1 text-xl font-semibold text-slate-900">24 Saat</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Görüşme Tipi</p>
                    <p className="mt-1 text-xl font-semibold text-slate-900">Online / Ofis</p>
                  </div>
                </div>

                <p className="mt-6 text-sm text-slate-600">
                  veya bize yazın: <span className="font-semibold text-slate-900">info@ankarom.com</span>
                </p>
              </div>
            </div>

            <div className="space-y-4 lg:col-span-3">
            <form onSubmit={handleSupportSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                type="text"
                name="adSoyad"
                placeholder="Ad Soyad"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition-colors focus:border-blue-400"
              />
              <input
                type="tel"
                name="telefon"
                placeholder="Telefon"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition-colors focus:border-blue-400"
              />
              <div className="relative sm:col-span-2">
                <input
                  type="text"
                  name="sehir"
                  placeholder="İl"
                  value={cityQuery}
                  onChange={(event) => {
                    setCityQuery(event.target.value);
                    setIsCityListOpen(true);
                  }}
                  onFocus={() => setIsCityListOpen(true)}
                  onBlur={() => {
                    setTimeout(() => setIsCityListOpen(false), 120);
                  }}
                  autoComplete="off"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition-colors focus:border-blue-400"
                />

                {isCityListOpen && filteredCities.length > 0 && (
                  <ul className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-[0_16px_38px_rgba(15,23,42,0.08)]">
                    {filteredCities.map((city) => (
                      <li key={city}>
                        <button
                          type="button"
                          onMouseDown={() => {
                            setCityQuery(city);
                            setIsCityListOpen(false);
                          }}
                          className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
                        >
                          {city}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <input
                type="email"
                name="email"
                placeholder="E-posta"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition-colors focus:border-blue-400 sm:col-span-2"
              />
              <input
                type="text"
                name="ilgilendigiUrun"
                placeholder="Hangi ürün ile ilgileniyorsunuz?"
                value={interestedProduct}
                onChange={(event) => setInterestedProduct(event.target.value)}
                className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition-colors focus:border-blue-400 sm:col-span-2"
              />
              <textarea
                name="mesaj"
                placeholder="Mesajınız"
                rows={5}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-blue-400 sm:col-span-2"
              />
              <button
                type="submit"
                disabled={isSubmittingSupport}
                className="h-12 rounded-xl bg-blue-600 px-6 text-sm font-bold uppercase tracking-[0.14em] text-slate-50 transition-all hover:bg-blue-700 sm:col-span-2"
              >
                {isSubmittingSupport ? "Gönderiliyor..." : "Gönder"}
              </button>

              {supportFeedback && <p className="text-sm text-slate-600 sm:col-span-2">{supportFeedback}</p>}

            </form>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
