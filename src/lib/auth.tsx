"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, ApiError, clearToken, getToken, setToken } from "./api";
import type { Role, User } from "./types";

interface AuthResponse {
  user: User;
  token: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (input: { name: string; email: string; password: string; role: Exclude<Role, "admin"> }) => Promise<User>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore the session on every full page load (reload keeps the user signed in).
  useEffect(() => {
    let alive = true;
    async function restore() {
      if (!getToken()) {
        if (alive) setLoading(false);
        return;
      }
      try {
        const res = await api<{ user: User }>("/auth/session");
        if (alive) setUser(res.user);
      } catch (err) {
        // Only drop the token when the server says it is invalid, not on network errors.
        if (err instanceof ApiError && (err.status === 401 || err.status === 403)) clearToken();
      } finally {
        if (alive) setLoading(false);
      }
    }
    restore();
    return () => {
      alive = false;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const res = await api<AuthResponse>("/auth/sign-in", { method: "POST", body: { email, password } });
    setToken(res.token);
    setUser(res.user);
    return res.user;
  }, []);

  const signUp = useCallback(
    async (input: { name: string; email: string; password: string; role: Exclude<Role, "admin"> }) => {
      const res = await api<AuthResponse>("/auth/sign-up", { method: "POST", body: input });
      setToken(res.token);
      setUser(res.user);
      return res.user;
    },
    [],
  );

  const signOut = useCallback(async () => {
    try {
      await api("/auth/sign-out", { method: "POST" });
    } catch {
      /* ignore, we clear locally anyway */
    }
    clearToken();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await api<{ user: User }>("/auth/session");
      setUser(res.user);
    } catch {
      /* keep current user */
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, signIn, signUp, signOut, refreshUser, setUser }),
    [user, loading, signIn, signUp, signOut, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
