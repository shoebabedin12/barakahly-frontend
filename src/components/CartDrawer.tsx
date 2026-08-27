"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { removeCartItem, updateCartItem } from "@/lib/cart";
import { IconShoppingBag, IconXMark } from "./icons";

export function CartDrawer() {
  const { cart, loading, isDrawerOpen, closeCart, refreshCart } = useCart();
  const [busyItemId, setBusyItemId] = useState<number | null>(null);

  useEffect(() => {
    if (!isDrawerOpen) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeCart();
    }

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen, closeCart]);

  async function handleQuantityChange(itemId: number, quantity: number) {
    if (quantity < 1) return;
    setBusyItemId(itemId);
    try {
      await updateCartItem(itemId, quantity);
      await refreshCart();
    } finally {
      setBusyItemId(null);
    }
  }

  async function handleRemove(itemId: number) {
    setBusyItemId(itemId);
    try {
      await removeCartItem(itemId);
      await refreshCart();
    } finally {
      setBusyItemId(null);
    }
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <>
      <div
        onClick={closeCart}
        aria-hidden="true"
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity ${
          isDrawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 dark:bg-gray-900 ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 dark:border-white/10">
          <h2 className="text-lg font-semibold text-dark">
            Your Cart{cart && cart.count > 0 ? ` (${cart.count})` : ""}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-background dark:hover:bg-white/10"
          >
            <IconXMark className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading && <p className="pt-10 text-center text-sm text-dark/40">Loading...</p>}

          {!loading && isEmpty && (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <IconShoppingBag className="h-10 w-10 text-dark/20" />
              <p className="text-sm text-dark/50">Your cart is empty.</p>
              <Link
                href="/products"
                onClick={closeCart}
                className="mt-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-background"
              >
                Continue shopping
              </Link>
            </div>
          )}

          {!loading && !isEmpty && cart && (
            <div className="flex flex-col gap-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-black/5 dark:bg-white/5">
                    {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                  </div>

                  <div className="flex flex-1 flex-col">
                    <p className="line-clamp-1 text-sm font-medium text-dark">{item.name}</p>
                    {(item.variant_color || item.variant_size) && (
                      <p className="text-xs text-dark/50">
                        {[item.variant_color, item.variant_size].filter(Boolean).join(" / ")}
                      </p>
                    )}
                    <p className="mt-0.5 text-sm font-semibold text-primary">{item.unit_price.toFixed(0)} &#2547;</p>

                    <div className="mt-auto flex items-center justify-between pt-1">
                      <div className="flex items-center rounded-full border border-black/15 dark:border-white/20">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={busyItemId === item.id || item.quantity <= 1}
                          className="h-7 w-7 text-sm disabled:opacity-40"
                        >
                          &minus;
                        </button>
                        <span className="w-5 text-center text-xs">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={busyItemId === item.id || item.quantity >= item.max_stock}
                          className="h-7 w-7 text-sm disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        disabled={busyItemId === item.id}
                        className="text-xs text-danger hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!loading && !isEmpty && cart && (
          <div className="border-t border-black/10 px-5 py-4 dark:border-white/10">
            <div className="mb-3 flex items-center justify-between text-sm font-semibold text-dark">
              <span>Subtotal</span>
              <span>{cart.subtotal.toFixed(0)} &#2547;</span>
            </div>
            <div className="flex gap-2">
              <Link
                href="/cart"
                onClick={closeCart}
                className="flex-1 rounded-full border border-black/15 py-2.5 text-center text-sm font-semibold text-dark dark:border-white/20"
              >
                View Cart
              </Link>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="flex-1 rounded-full bg-primary py-2.5 text-center text-sm font-semibold text-background"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
