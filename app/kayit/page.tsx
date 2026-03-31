"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { register, isAuthenticated } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/hesabim");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      await register(name, email, password);
      router.push("/hesabim");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Kayıt sırasında bir hata oluştu.";
      setErrorMessage(message);
    }
  };

  return (
    <section className="relative flex min-h-[calc(100vh-180px)] items-center justify-center overflow-hidden px-5 py-10">
      <div className="pointer-events-none absolute -left-20 top-16 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="flex w-full max-w-md flex-col gap-4 rounded-4xl border border-slate-200 bg-white px-8 py-10 shadow-[0_28px_90px_rgba(15,23,42,0.08)]">
        <div className="mb-14 flex items-center gap-2">
          <Image src="/ankarom.png" alt="Ankarom" width={30} height={30} className="brand-mark rounded-full" />
          <span className="text-lg font-bold tracking-tight text-slate-900">Ankarom</span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Hesap Oluşturun</h1>
        <p className="mt-3 text-sm text-slate-600">Lütfen aşağıya bilgilerinizi girin</p>

        <form onSubmit={handleRegister} className="flex flex-col gap-4 mt-12 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 transition-all focus-within:border-blue-400 focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.12)]">
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="İsim Soyisim"
              required
              className="w-full bg-transparent text-base text-slate-900 placeholder:text-slate-400 outline-none"
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 transition-all focus-within:border-blue-400 focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.12)]">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Mail Adresi"
              required
              className="w-full bg-transparent text-base text-slate-900 placeholder:text-slate-400 outline-none"
            />
          </div>

       


<div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 transition-all focus-within:border-blue-400 focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.12)]">
  <input
    type={showPassword ? "text" : "password"}
    value={password}
    onChange={(event) => setPassword(event.target.value)}
    placeholder="Şifre"
    required
    className="w-full bg-transparent text-base text-slate-900 placeholder:text-slate-400 outline-none"
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="text-slate-500"
  >
    {showPassword ? (
      <EyeIcon className="h-5 w-5" />
    ) : (
      <EyeSlashIcon className="h-5 w-5" />
    )}
  </button>
</div>

          {errorMessage && <p className="text-sm text-rose-600">{errorMessage}</p>}

          <button
            type="submit"
            className="mt-2 w-full rounded-2xl bg-blue-600 px-4 py-4 text-lg font-semibold text-slate-50 shadow-[0_10px_24px_rgba(37,99,235,0.18)] transition-all hover:bg-blue-700"
          >
            Kayıt Ol
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-slate-500">
          Zaten Hesabınız Var Mı ?{" "}
          <Link href="/giris" className="font-semibold text-blue-700 hover:text-blue-800">
            Giriş Yap
          </Link>
        </p>
      </div>
    </section>
  );
}