"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { EyeSlashIcon } from "@heroicons/react/24/outline";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { register, isAuthenticated } = useAuth();
  const router = useRouter();

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
      <div className="pointer-events-none absolute -left-20 top-16 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-24 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />

      <div className="flex flex-col gap-4 w-full max-w-md rounded-4xl border border-white/10 bg-slate-900/70 px-8 py-10 shadow-[0_28px_90px_rgba(2,6,23,0.7)] backdrop-blur-2xl">
        <div className="mb-14 flex items-center gap-2">
          <Image src="/ankarom.png" alt="Ankarom" width={30} height={30} className="rounded-full" />
          <span className="text-lg font-bold tracking-tight text-white">Ankarom</span>
        </div>

        <h1 className="text-5xl font-extrabold tracking-tight text-white">Create Account</h1>
        <p className="mt-3 text-lg text-slate-400">Please enter your details below</p>

        <form onSubmit={handleRegister} className="flex flex-col gap-4 mt-12 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition-all focus-within:border-cyan-400/70 focus-within:shadow-[0_0_0_3px_rgba(34,211,238,0.15)]">
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Full Name"
              required
              className="w-full bg-transparent text-base text-white placeholder:text-slate-400 outline-none"
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition-all focus-within:border-cyan-400/70 focus-within:shadow-[0_0_0_3px_rgba(34,211,238,0.15)]">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              required
              className="w-full bg-transparent text-base text-white placeholder:text-slate-400 outline-none"
            />
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition-all focus-within:border-indigo-400/70 focus-within:shadow-[0_0_0_3px_rgba(129,140,248,0.15)]">
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              required
              className="w-full bg-transparent text-base text-white placeholder:text-slate-400 outline-none"
            />
            <EyeSlashIcon className="h-5 w-5 text-slate-400" />
          </div>

          {errorMessage && <p className="text-sm text-rose-300">{errorMessage}</p>}

          <button
            type="submit"
            className="mt-2 w-full rounded-2xl bg-slate-950 px-4 py-4 text-lg font-semibold text-white shadow-[0_10px_24px_rgba(2,6,23,0.55)] transition-all hover:brightness-110"
          >
            Sign up
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/giris" className="font-semibold text-cyan-300 hover:text-cyan-200">
            Sign In
          </Link>
        </p>
      </div>
    </section>
  );
}