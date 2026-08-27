"use client";

import { createContext, useCallback, useContext, useState } from "react";

interface QuickViewContextValue {
  openSlug: string | null;
  openQuickView: (slug: string) => void;
  closeQuickView: () => void;
}

const QuickViewContext = createContext<QuickViewContextValue | null>(null);

export function QuickViewProvider({ children }: { children: React.ReactNode }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const openQuickView = useCallback((slug: string) => setOpenSlug(slug), []);
  const closeQuickView = useCallback(() => setOpenSlug(null), []);

  return (
    <QuickViewContext.Provider value={{ openSlug, openQuickView, closeQuickView }}>
      {children}
    </QuickViewContext.Provider>
  );
}

export function useQuickView() {
  const ctx = useContext(QuickViewContext);
  if (!ctx) throw new Error("useQuickView must be used within a QuickViewProvider");
  return ctx;
}
