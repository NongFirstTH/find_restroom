// hooks/useAuth.ts
import { useState } from "react";
import type { AuthSession, User } from "../types";

const KEY = "restroom_finder_session";

function getSavedSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(getSavedSession);

  const login = (s: AuthSession) => {
    localStorage.setItem(KEY, JSON.stringify(s));
    setSession(s);
  };

  /** Called by fetchWithAuth when a silent token refresh succeeds. */
  const updateTokens = (accessToken: string, refreshToken: string) => {
    setSession((prev) => {
      if (!prev) return null;
      const updated = { ...prev, accessToken, refreshToken };
      localStorage.setItem(KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    localStorage.removeItem(KEY);
    setSession(null);
  };

  return {
    session,
    user: session?.user ?? null as User | null,
    accessToken: session?.accessToken ?? null,
    refreshToken: session?.refreshToken ?? null,
    login,
    updateTokens,
    logout,
  };
}
