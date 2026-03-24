"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AuthUser = {
  name: string;
  email: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  register: (name: string, email: string, password: string) => void;
  loginWithGoogle: (redirectTo?: string) => void;
  logout: () => void;
};

const STORAGE_KEY = "ankarom-auth-user";
const GOOGLE_SCOPE = "openid email profile";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const getNameFromEmail = (email: string) => {
  const localPart = email.split("@")[0] || "Kullanıcı";
  return localPart
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const parseGoogleAuthHash = async () => {
      if (typeof window === "undefined") {
        return;
      }

      const queryParams = new URLSearchParams(window.location.search);
      const authError = queryParams.get("error") || queryParams.get("error_description");
      if (authError) {
        window.alert("Google yetkilendirme hatası: OAuth istemci ayarlarını kontrol edin.");
        window.history.replaceState(null, "", window.location.pathname);
        return;
      }

      if (!window.location.hash.includes("access_token=")) {
        return;
      }

      const hash = window.location.hash.replace(/^#/, "");
      const params = new URLSearchParams(hash);
      const accessToken = params.get("access_token");
      const state = params.get("state");

      if (!accessToken) {
        return;
      }

      try {
        const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) {
          throw new Error("Google user info request failed");
        }

        const profile = (await response.json()) as { name?: string; email?: string };
        if (profile.email) {
          setUser({
            name: profile.name?.trim() || getNameFromEmail(profile.email),
            email: profile.email,
          });
        }
      } catch {
      } finally {
        const redirectPath = state ? decodeURIComponent(atob(state)) : "/hesabim";
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
        window.location.replace(redirectPath || "/hesabim");
      }
    };

    parseGoogleAuthHash();
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AuthUser;
        if (parsed?.email) {
          setUser(parsed);
        }
      }
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
  }, [user, isHydrated]);

  const login = (email: string) => {
    setUser({ name: getNameFromEmail(email), email });
  };

  const register = (name: string, email: string) => {
    const normalizedName = name.trim() || getNameFromEmail(email);
    setUser({ name: normalizedName, email });
  };

  const loginWithGoogle = (redirectTo = "/hesabim") => {
    if (typeof window === "undefined") {
      return;
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId || clientId.includes("your-google-oauth-client-id")) {
      window.alert("Google giriş için .env.local içindeki NEXT_PUBLIC_GOOGLE_CLIENT_ID değerine gerçek OAuth Client ID yazılmalı.");
      return;
    }

    const redirectUri = `${window.location.origin}/giris`;
    const state = btoa(encodeURIComponent(redirectTo));

    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("response_type", "token");
    authUrl.searchParams.set("scope", GOOGLE_SCOPE);
    authUrl.searchParams.set("prompt", "select_account");
    authUrl.searchParams.set("state", state);

    window.location.assign(authUrl.toString());
  };

  const logout = () => {
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      register,
      loginWithGoogle,
      logout,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
