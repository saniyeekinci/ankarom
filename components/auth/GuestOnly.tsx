"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

export default function GuestOnly({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/hesabim");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
