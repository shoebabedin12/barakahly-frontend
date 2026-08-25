"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { applyCoupon, removeCartItem, updateCartItem } from "@/lib/cart";
import { ApiError } from "@/lib/api";
import { getAppliedCoupon, setAppliedCoupon, type AppliedCoupon } from "@/lib/coupon";

export default function CartPage() {
  const { cart, loading, refreshCart } = useCart();
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [busyItemId, setBusyItemId] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading a client-only localStorage value on mount
    setCoupon(getAppliedCoupon());
  }, []);

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

  async function handleApplyCoupon() {
    if (!couponInput.trim()) return;
    setApplyingCoupon(true);
    setCouponError(null);
    try {
      const result = await applyCoupon(couponInput.trim());
      setAppliedCoupon(result);
      setCoupon(result);
    } catch (error) {
      setCouponError(error instanceof ApiError ? error.message : "Could not apply coupon.");
    } finally {
      setApplyingCoupon(false);
    }
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCoupon(null);
    setCouponInput("");
  }

  if (loading) {
    return <p className="mx-auto max-w-4xl px-4 py-16 text-center text-dark/60">Loading cart...</p>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="text-dark/60">Your cart is empty.</p>
        <Link href="/products" className="mt-4 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-background">
          Continue shopping
        </Link>
      </div>
    );
  }

  const discount = coupon?.discount ?? 0;
  const total = Math.max(0, cart.subtotal - discount);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-xl font-semibold text-dark">Your cart</h1>

      <div className="flex flex-col gap-4">
        {cart.items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 rounded-xl border border-black/10 p-4 dark:border-white/10"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-black/5 dark:bg-white/5">
              {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
            </div>

            <div className="flex flex-1 flex-col">
              <p className="font-medium text-dark">{item.name}</p>
              {(item.variant_color || item.variant_size) && (
                <p className="text-sm text-dark/60">
                  {[item.variant_color, item.variant_size].filter(Boolean).join(" / ")}
                </p>
              )}
              <p className="mt-1 text-sm font-semibold text-primary">{item.unit_price.toFixed(0)} &#2547;</p>

              <div className="mt-auto flex items-center justify-between pt-2">
                <div className="flex items-center rounded-full border border-black/15 dark:border-white/20">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={busyItemId === item.id || item.quantity <= 1}
                    className="h-8 w-8 text-base disabled:opacity-40"
                  >
                    &minus;
                  </button>
                  <span className="w-6 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    disabled={busyItemId === item.id || item.quantity >= item.max_stock}
                    className="h-8 w-8 text-base disabled:opacity-40"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => handleRemove(item.id)}
                  disabled={busyItemId === item.id}
                  className="text-sm text-danger hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-black/10 p-4 dark:border-white/10">
        {coupon ? (
          <div className="mb-4 flex items-center justify-between text-sm">
            <span>
              Coupon <span className="font-semibold">{coupon.code}</span> applied
            </span>
            <button onClick={handleRemoveCoupon} className="text-danger hover:underline">
              Remove
            </button>
          </div>
        ) : (
          <div className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Coupon code"
                className="flex-1 rounded-full border border-black/10 bg-white px-4 py-2 text-sm dark:border-white/10 dark:bg-white/5"
              />
              <button
                onClick={handleApplyCoupon}
                disabled={applyingCoupon}
                className="rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary disabled:opacity-50"
              >
                Apply
              </button>
            </div>
            {couponError && <p className="mt-2 text-sm text-danger">{couponError}</p>}
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-dark/70">
          <span>Subtotal</span>
          <span>{cart.subtotal.toFixed(0)} &#2547;</span>
        </div>
        {discount > 0 && (
          <div className="mt-1 flex items-center justify-between text-sm text-success">
            <span>Discount</span>
            <span>-{discount.toFixed(0)} &#2547;</span>
          </div>
        )}
        <div className="mt-2 flex items-center justify-between border-t border-black/10 pt-2 text-base font-semibold text-dark dark:border-white/10">
          <span>Total (before shipping)</span>
          <span>{total.toFixed(0)} &#2547;</span>
        </div>

        <Link
          href="/checkout"
          className="mt-4 block rounded-full bg-primary px-6 py-3 text-center text-sm font-semibold text-background"
        >
          Proceed to checkout
        </Link>
      </div>
    </div>
  );
}
