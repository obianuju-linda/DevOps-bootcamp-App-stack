"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

type User = {
  id: string;
  email: string;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "devlink_auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? window.localStorage.getItem(STORAGE_KEY)
          : null;
      if (raw) {
        const parsed = JSON.parse(raw) as { user: User; token: string };
        setUser(parsed.user);
        setToken(parsed.token);
      }
    } catch (e) {
      console.error("Failed to parse auth from storage", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persist = useCallback(
    (nextUser: User | null, nextToken: string | null) => {
      setUser(nextUser);
      setToken(nextToken);
      if (typeof window === "undefined") return;
      if (nextUser && nextToken) {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ user: nextUser, token: nextToken })
        );
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    },
    []
  );

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          return false;
        }
        persist(data.user, data.token);
        return true;
      } catch (e) {
        console.error("Login failed", e);
        return false;
      }
    },
    [persist]
  );

  const register = useCallback(
    async (email: string, password: string) => {
      try {
        const res = await fetch(`${API_BASE}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          return false;
        }
        // Auto-login after registration
        persist(data.user, data.token);
        return true;
      } catch (e) {
        console.error("Registration failed", e);
        return false;
      }
    },
    [persist]
  );

  const logout = useCallback(() => {
    persist(null, null);
  }, [persist]);

  const value: AuthContextValue = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

