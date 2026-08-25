"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getCart } from "@/lib/cart";
import type { CartResponse } from "@/lib/types";

interface CartContextValue {
  cart: CartResponse | null;
  loading: boolean;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshCart = useCallback(async () => {
    try {
      const data = await getCart();
      setCart(data);
    } catch {
      // Cart fetch failing (e.g. API unreachable) shouldn't crash the shell.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial cart load on mount
    refreshCart();
  }, [refreshCart]);

  return (
    <CartContext.Provider value={{ cart, loading, refreshCart }}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
