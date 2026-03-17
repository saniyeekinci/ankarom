"use client";

import { useMemo, useState } from "react";

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

  const filteredCities = useMemo(() => {
    const query = cityQuery.trim().toLocaleLowerCase("tr-TR");

    if (!query) {
      return cities;
    }

    return cities
      .filter((city) => city.toLocaleLowerCase("tr-TR").includes(query))
      .slice(0, 12);
  }, [cityQuery]);

  return (
    <section className="flex min-h-[calc(100vh-220px)] w-full items-center justify-center py-10 sm:py-14">
      <div className="flex w-full justify-center px-6 md:px-12">
        <div className="w-full max-w-5xl rounded-3xl border border-white/10 bg-slate-900/55 p-6 shadow-[0_20px_60px_rgba(2,6,23,0.45)] backdrop-blur-xl sm:p-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-10">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300 sm:p-7 lg:col-span-2">
              <div className="pointer-events-none absolute -left-14 bottom-0 h-36 w-36 rounded-full bg-amber-500/12 blur-3xl" />

              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Schedule a demo</span>

              <h1 className="mt-5 text-4xl font-bold leading-[1.05] text-white sm:text-5xl">
                Akıllı
                <span className="bg-linear-to-r from-amber-300 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent"> Çözümler </span>
                
                Sizin İçin
                <br />
                Uygun mu?
              </h1>

              <p className="mt-6 text-base leading-relaxed text-slate-300">
                Operasyonunuza en uygun ürünü birlikte belirleyelim. Kısa bir ön görüşme ile ihtiyaçlarınızı analiz edip size özel teklif sunalım.
              </p>

              <div className="mt-8 border-t border-white/10 pt-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Görüşme Süresi</p>
                    <p className="mt-1 text-xl font-semibold text-white">20-30 dk</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Dönüş Süresi</p>
                    <p className="mt-1 text-xl font-semibold text-white">24 Saat</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Görüşme Tipi</p>
                    <p className="mt-1 text-xl font-semibold text-white">Online / Ofis</p>
                  </div>
                </div>

                <p className="mt-6 text-sm text-slate-300">
                  veya bize yazın: <span className="font-semibold text-white">info@ankarom.com</span>
                </p>
              </div>
            </div>

            <form className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-3">
              <input
                type="text"
                name="adSoyad"
                placeholder="Ad Soyad"
                className="h-12 rounded-xl border border-white/15 bg-slate-950/70 px-4 text-sm text-white outline-none transition-colors focus:border-amber-500"
              />
              <input
                type="tel"
                name="telefon"
                placeholder="Telefon"
                className="h-12 rounded-xl border border-white/15 bg-slate-950/70 px-4 text-sm text-white outline-none transition-colors focus:border-amber-500"
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
                  className="h-12 w-full rounded-xl border border-white/15 bg-slate-950/70 px-4 text-sm text-white outline-none transition-colors focus:border-amber-500"
                />

                {isCityListOpen && filteredCities.length > 0 && (
                  <ul className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 max-h-56 overflow-y-auto rounded-xl border border-white/10 bg-slate-900/95 p-1 shadow-[0_16px_38px_rgba(2,6,23,0.6)] backdrop-blur-xl">
                    {filteredCities.map((city) => (
                      <li key={city}>
                        <button
                          type="button"
                          onMouseDown={() => {
                            setCityQuery(city);
                            setIsCityListOpen(false);
                          }}
                          className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-100 transition-colors hover:bg-white/10"
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
                className="h-12 rounded-xl border border-white/15 bg-slate-950/70 px-4 text-sm text-white outline-none transition-colors focus:border-amber-500 sm:col-span-2"
              />
              <input
                type="text"
                name="ilgilendigiUrun"
                placeholder="Hangi ürün ile ilgileniyorsunuz?"
                className="h-12 rounded-xl border border-white/15 bg-slate-950/70 px-4 text-sm text-white outline-none transition-colors focus:border-amber-500 sm:col-span-2"
              />
              <textarea
                name="mesaj"
                placeholder="Mesajınız"
                rows={5}
                className="rounded-xl border border-white/15 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-amber-500 sm:col-span-2"
              />
              <button
                type="submit"
                className="h-12 rounded-xl border border-amber-500/70 bg-amber-600 px-6 text-sm font-bold uppercase tracking-[0.14em] text-white transition-all hover:bg-amber-500 sm:col-span-2"
              >
                Gönder
              </button>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300 sm:col-span-2">
                Çalışma Saatleri: Pzt - Cmt / 09:00 - 18:00
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
