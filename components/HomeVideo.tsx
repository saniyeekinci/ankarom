"use client";

const scrollToStats = () => {
  const element = document.getElementById("stats-section");
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

export default function HomeVideo() {
  return (
    <section className="relative w-full p-0 m-0">
      <div className="relative w-full aspect-video min-h-[300px] overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          preload="metadata"
        >
          <source src="/videos/Homevideo.mp4" type="video/mp4" />
        </video>

        {/* Başlık — üst 1/4 konumunda */}
        <div className="absolute top-1/7 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white px-4 w-full">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight drop-shadow-lg">
            Çok Amaçlı Taşımacılıkta Yeni Nesil Çözümler
          </h1>
          <p className="text-sm sm:text-base md:text-xl lg:text-2xl drop-shadow-md">
            Sertifikalı düşürülebilir römork teknolojisi ile güvenli ve pratik
            sevkiyatın adresi.
          </p>
        </div>

       
      </div>
    </section>
  );
}