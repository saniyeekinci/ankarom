export default function AccountPage() {
  return (
    <section className="relative flex min-h-[calc(100vh-180px)] items-center justify-center overflow-hidden px-5 py-10">
      <div className="flex w-full max-w-md flex-col gap-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Hesap Sistemi Kapalı
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          Kişisel hesap sistemi kaldırılmıştır.
        </p>
      </div>
    </section>
  );
}
