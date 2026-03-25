"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "admin" | "user";
};

export type ProfileUpdatePayload = {
  name?: string;
  email?: string;
  phone?: string;
  currentPassword?: string;
  newPassword?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (name: string, email: string, password: string) => Promise<AuthUser>;
  updateProfile: (payload: ProfileUpdatePayload) => Promise<AuthUser>;
  loginWithGoogle: (redirectTo?: string) => void;
  logout: () => void;
};

const STORAGE_KEY = "ankarom-auth-session";
const GOOGLE_SCOPE = "openid email profile";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
  const [token, setToken] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const setSession = (sessionUser: AuthUser, sessionToken: string) => {
    setUser(sessionUser);
    setToken(sessionToken);
  };

  const authenticateWithBackend = async (
    endpoint: "login" | "register" | "google",
    payload: Record<string, unknown>,
  ): Promise<AuthUser> => {
    let response: Response;

    try {
      response = await fetch(`${API_BASE_URL}/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      throw new Error(
        `Backend'e bağlanılamadı. API adresi: ${API_BASE_URL}. Backend sunucusunun çalıştığını ve CORS ayarlarını kontrol edin.`,
      );
    }

    const data = (await response.json()) as {
      message?: string;
      token?: string;
      user?: AuthUser;
    };

    if (!response.ok || !data.token || !data.user?.id) {
      throw new Error(data.message || "Kimlik doğrulama işlemi başarısız oldu.");
    }

    setSession(data.user, data.token);
    return data.user;
  };

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

        const profile = (await response.json()) as { name?: string; email?: string; sub?: string };
        if (profile.email) {
          await authenticateWithBackend("google", {
            email: profile.email,
            name: profile.name?.trim() || getNameFromEmail(profile.email),
            googleId: profile.sub || null,
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
        const parsed = JSON.parse(raw) as { user?: AuthUser; token?: string };
        if (parsed?.user?.id && parsed?.token) {
          setUser(parsed.user);
          setToken(parsed.token);
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

    if (user && token) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
  }, [user, token, isHydrated]);

  const login = async (email: string, password: string) => {
    return authenticateWithBackend("login", { email, password });
  };

  const register = async (name: string, email: string, password: string) => {
    return authenticateWithBackend("register", { name, email, password });
  };

  const updateProfile = async (payload: ProfileUpdatePayload): Promise<AuthUser> => {
    if (!token) {
      throw new Error("Profil güncellemek için oturum açmalısınız.");
    }

    let response: Response;

    try {
      response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
    } catch {
      throw new Error("Backend'e bağlanılamadı. Profil güncellenemedi.");
    }

    const data = (await response.json()) as {
      message?: string;
      user?: AuthUser;
    };

    if (!response.ok || !data.user?.id) {
      throw new Error(data.message || "Profil güncellenemedi.");
    }

    setUser(data.user);
    return data.user;
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
    setToken(null);

    if (typeof window !== "undefined") {
      window.location.replace("/");
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user),
      login,
      register,
      updateProfile,
      loginWithGoogle,
      logout,
    }),
    [user, token],
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
