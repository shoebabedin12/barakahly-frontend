"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { getToken, logout as clearToken } from "@/lib/auth";
import type { Customer } from "@/lib/types";

interface AuthContextValue {
  customer: Customer | null;
  loading: boolean;
  refreshAuth: () => Promise<void>;
  setCustomer: (customer: Customer | null) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAuth = useCallback(async () => {
    if (!getToken()) {
      setCustomer(null);
      setLoading(false);
      return;
    }
    try {
      const response = await apiGet<{ customer: Customer }>("/api/v1/auth/me");
      setCustomer(response.customer);
    } catch {
      clearToken();
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial auth check on mount
    refreshAuth();
  }, [refreshAuth]);

  const signOut = useCallback(() => {
    clearToken();
    setCustomer(null);
  }, []);

  return (
    <AuthContext.Provider value={{ customer, loading, refreshAuth, setCustomer, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
