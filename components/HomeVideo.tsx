"use client";

export default function HomeVideo() {
  return (
    <section className="relative w-full min-h-screen bg-gradient-to-b from-white to-gray-100 flex items-center justify-center px-6 text-center">

      <div className="max-w-4xl mx-auto flex flex-col items-center">

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
          Çok Amaçlı Taşımacılıkta
          <br />
          <span className="text-blue-700">Yeni Nesil Çözümler</span>
        </h1>

        <p className="mt-6 text-gray-600 text-base sm:text-lg md:text-xl max-w-2xl">
          Sertifikalı düşürülebilir römork teknolojisi ile güvenli, yenilikçi ve pratik sevkiyat çözümleri sunuyoruz.
        </p>

        <button
          onClick={() =>
            document
              .getElementById("stats-section")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="mt-10 px-10 py-4 text-lg font-semibold bg-blue-700 text-white rounded-xl shadow-lg hover:bg-blue-800 transition"
        >
          Daha Fazla Bilgi
        </button>
      </div>

    </section>
  );
}