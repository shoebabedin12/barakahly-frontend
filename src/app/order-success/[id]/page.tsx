"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { IconCheckCircle } from "@/components/icons";
import { ApiError } from "@/lib/api";
import { getPlacedOrder } from "@/lib/checkout";
import { getOrder } from "@/lib/queries";
import { trackPurchase } from "@/lib/tracking";
import type { Order } from "@/lib/types";

const PAYMENT_BANNERS: Record<string, { tone: "success" | "danger"; message: string }> = {
  success: { tone: "success", message: "Payment completed successfully." },
  failed: { tone: "danger", message: "Payment failed. Your order is saved with pending payment - please try again or contact support." },
  cancelled: { tone: "danger", message: "Payment was cancelled." },
  invalid: { tone: "danger", message: "Invalid or expired payment session." },
};

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<p className="mx-auto max-w-lg px-4 py-16 text-center text-dark/60">Loading your order...</p>}>
      <OrderSuccessContent />
    </Suspense>
  );
}

function OrderSuccessContent() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const paymentState = searchParams.get("payment");

  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOrder(params.id)
      .then(setOrder)
      .catch((err) => {
        const placed = getPlacedOrder(params.id);
        if (placed) setOrder(placed);
        else setError(err instanceof ApiError ? err.message : "Could not load your order.");
      });
  }, [params.id]);

  useEffect(() => {
    // Online payments only count once the gateway confirmed them.
    if (order && (order.payment_status === "paid" || !paymentState)) trackPurchase(order);
  }, [order, paymentState]);

  const banner = paymentState ? PAYMENT_BANNERS[paymentState] : null;

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-5 py-20 text-center">
        <p className="text-danger">{error}</p>
        <Link href="/" className="mt-4 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-background">
          Back to home
        </Link>
      </div>
    );
  }

  if (!order) {
    return <p className="mx-auto max-w-lg px-4 py-16 text-center text-dark/60">Loading your order...</p>;
  }

  return (
    <div className="mx-auto max-w-lg px-5 py-20 text-center">
      {banner && (
        <div
          className={`mb-6 rounded-lg p-3 text-left text-sm font-medium ${
            banner.tone === "success" ? "bg-success/15 text-success" : "bg-danger/15 text-danger"
          }`}
        >
          {banner.message}
        </div>
      )}

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
        <IconCheckCircle className="h-9 w-9" />
      </div>

      <h1 className="mt-6 text-2xl font-bold text-dark sm:text-3xl">Thank You For Your Order!</h1>
      <p className="mt-3 text-dark/60">Your order has been placed successfully. We&apos;ll be in touch soon.</p>

      <div className="mt-8 space-y-4 rounded-2xl border border-black/10 p-6 text-left dark:border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-sm text-dark/60">Order Number</span>
          <span className="font-semibold text-dark">{order.order_number}</span>
        </div>

        <div className="flex items-center justify-between border-t border-black/10 pt-4 dark:border-white/10">
          <span className="text-sm text-dark/60">Total Amount</span>
          <span className="font-semibold text-dark">{order.total_amount.toFixed(0)} &#2547;</span>
        </div>

        <div className="flex items-center justify-between border-t border-black/10 pt-4 dark:border-white/10">
          <span className="text-sm text-dark/60">Order Status</span>
          <span className="rounded-full bg-secondary/15 px-3 py-1 text-xs font-semibold capitalize text-dark">
            {order.order_status}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-black/10 pt-4 dark:border-white/10">
          <span className="text-sm text-dark/60">Payment</span>
          <span className="text-right text-sm font-medium capitalize text-dark">
            {order.payment_status} ({order.payment_method})
          </span>
        </div>
      </div>

      <Link
        href="/products"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-background transition hover:opacity-90"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
