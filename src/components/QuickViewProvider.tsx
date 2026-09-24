"use client";

import { createContext, useCallback, useContext, useState } from "react";

export type QuickViewIntent = "cart" | "buy";

interface QuickViewContextValue {
  openSlug: string | null;
  intent: QuickViewIntent;
  openQuickView: (slug: string, intent?: QuickViewIntent) => void;
  closeQuickView: () => void;
}

const QuickViewContext = createContext<QuickViewContextValue | null>(null);

export function QuickViewProvider({ children }: { children: React.ReactNode }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [intent, setIntent] = useState<QuickViewIntent>("cart");

  const openQuickView = useCallback((slug: string, nextIntent: QuickViewIntent = "cart") => {
    setOpenSlug(slug);
    setIntent(nextIntent);
  }, []);
  const closeQuickView = useCallback(() => setOpenSlug(null), []);

  return (
    <QuickViewContext.Provider value={{ openSlug, intent, openQuickView, closeQuickView }}>
      {children}
    </QuickViewContext.Provider>
  );
}

export function useQuickView() {
  const ctx = useContext(QuickViewContext);
  if (!ctx) throw new Error("useQuickView must be used within a QuickViewProvider");
  return ctx;
}
