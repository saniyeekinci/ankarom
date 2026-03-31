"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"; // EyeIcon eklendi
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Şifre göster/gizle state
  const { login, isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(user?.role === "admin" ? "/admin" : "/hesabim");
    }
  }, [isAuthenticated, router, user]);

  if (isAuthenticated) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser.role === "admin") {
        router.push("/admin");
        return;
      }
      router.push("/hesabim");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Giriş sırasında bir hata oluştu.";
      setErrorMessage(message);
    }
  };

  return (
    <section className="relative flex min-h-[calc(100vh-180px)] items-center justify-center overflow-hidden px-5 py-10">
      <div className="pointer-events-none absolute -left-20 top-16 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="flex w-full max-w-md flex-col gap-4 rounded-4xl border border-slate-200 bg-white px-8 py-10 shadow-[0_28px_90px_rgba(15,23,42,0.08)]">
        <div className="mb-14 flex items-center gap-2">
          <Image
            src="/ankarom.png"
            alt="Ankarom"
            width={30}
            height={30}
            className="brand-mark rounded-full"
          />
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Ankarom
          </span>
        </div>

        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">
          Hoşgeldiniz !
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          Lütfen giriş bilgilerinizi aşağıya girin
        </p>

        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4 mt-12 space-y-4"
        >
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
              type={showPassword ? "text" : "password"} // Şifreyi göster/gizle
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

          <div className="pt-1 text-right text-sm font-medium text-slate-500">
            Şifremi Unuttum
          </div>

          {errorMessage && (
            <p className="text-sm text-rose-600">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="mt-2 w-full rounded-2xl bg-blue-600 px-4 py-4 text-lg font-semibold text-slate-50 shadow-[0_10px_24px_rgba(37,99,235,0.18)] transition-all hover:bg-blue-700"
          >
            Giriş Yap
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-slate-500">
          Hesabınız yok mu?{" "}
          <Link
            href="/kayit"
            className="font-semibold text-blue-700 hover:text-blue-800"
          >
            Kayıt Ol
          </Link>
        </p>
      </div>
    </section>
  );
}
