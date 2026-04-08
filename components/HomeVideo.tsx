"use client";

export default function HomeVideo() {
  return (
    <section className="fluid w-full bg-gradient-to-b from-slate-50 to-white p-0 m-0">
      <div className="overflow-hidden w-full aspect-video">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          preload="metadata"
        >
          <source src="/videos/Homevideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>      </div>
    </section>
  );
}