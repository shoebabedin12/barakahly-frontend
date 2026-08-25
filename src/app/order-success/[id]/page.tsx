"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ApiError } from "@/lib/api";
import { getOrder } from "@/lib/queries";
import type { Order } from "@/lib/types";

const PAYMENT_BANNERS: Record<string, { tone: "success" | "danger"; message: string }> = {
  success: { tone: "success", message: "Payment completed successfully." },
  failed: { tone: "danger", message: "Payment failed. Your order is saved with pending payment - please try again or contact support." },
  cancelled: { tone: "danger", message: "Payment was cancelled." },
  invalid: { tone: "danger", message: "Invalid or expired payment session." },
};

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<p className="mx-auto max-w-2xl px-4 py-16 text-center text-dark/60">Loading your order...</p>}>
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
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load your order."));
  }, [params.id]);

  const banner = paymentState ? PAYMENT_BANNERS[paymentState] : null;

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-danger">{error}</p>
        <Link href="/" className="mt-4 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-background">
          Back to home
        </Link>
      </div>
    );
  }

  if (!order) {
    return <p className="mx-auto max-w-2xl px-4 py-16 text-center text-dark/60">Loading your order...</p>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {banner && (
        <div
          className={`mb-6 rounded-lg p-3 text-sm font-medium ${
            banner.tone === "success" ? "bg-success/15 text-success" : "bg-danger/15 text-danger"
          }`}
        >
          {banner.message}
        </div>
      )}

      <div className="rounded-xl border border-black/10 p-6 text-center dark:border-white/10">
        <p className="text-3xl">&#10003;</p>
        <h1 className="mt-2 text-xl font-semibold text-dark">Thank you for your order!</h1>
        <p className="mt-1 text-sm text-dark/60">Order #{order.order_number}</p>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {order.items.map((item) => (
          <div key={item.id} className="flex gap-4 rounded-xl border border-black/10 p-3 dark:border-white/10">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-black/5 dark:bg-white/5">
              {item.image && <Image src={item.image} alt={item.product_name} fill className="object-cover" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-dark">{item.product_name}</p>
              {(item.variant_color || item.variant_size) && (
                <p className="text-xs text-dark/60">
                  {[item.variant_color, item.variant_size].filter(Boolean).join(" / ")}
                </p>
              )}
              <p className="text-xs text-dark/60">Qty {item.quantity}</p>
            </div>
            <p className="text-sm font-semibold text-primary">{item.subtotal.toFixed(0)} &#2547;</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-black/10 p-4 text-sm dark:border-white/10">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span>{order.subtotal.toFixed(0)} &#2547;</span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span>Shipping</span>
          <span>{order.shipping_charge.toFixed(0)} &#2547;</span>
        </div>
        {order.discount_amount > 0 && (
          <div className="mt-1 flex items-center justify-between text-success">
            <span>Discount</span>
            <span>-{order.discount_amount.toFixed(0)} &#2547;</span>
          </div>
        )}
        <div className="mt-2 flex items-center justify-between border-t border-black/10 pt-2 text-base font-semibold dark:border-white/10">
          <span>Total</span>
          <span>{order.total_amount.toFixed(0)} &#2547;</span>
        </div>
        <p className="mt-3 text-dark/60">
          Payment: {order.payment_method} &middot; {order.payment_status}
        </p>
        <p className="text-dark/60">Shipping to: {order.shipping_address}</p>
      </div>

      <Link
        href="/products"
        className="mt-6 block rounded-full bg-primary px-6 py-3 text-center text-sm font-semibold text-background"
      >
        Continue shopping
      </Link>
    </div>
  );
}
