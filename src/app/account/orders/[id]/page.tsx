"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api";
import { getOrder } from "@/lib/queries";
import type { Order } from "@/lib/types";

export default function AccountOrderDetailPage() {
  const params = useParams<{ id: string }>();

  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOrder(params.id)
      .then(setOrder)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load this order."));
  }, [params.id]);

  if (error) return <p className="text-sm text-danger">{error}</p>;
  if (!order) return <p className="text-sm text-dark/60">Loading order...</p>;

  return (
    <>
      <h1 className="text-2xl font-bold text-dark sm:text-3xl">Order {order.order_number}</h1>

      <div className="grid gap-4 rounded-xl border border-black/10 bg-white p-6 text-sm sm:grid-cols-3 dark:border-white/10 dark:bg-white/5">
        <div>
          <p className="text-dark/60">Order Date</p>
          <p className="font-medium text-dark">
            {new Date(order.created_at).toLocaleDateString(undefined, {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        <div>
          <p className="text-dark/60">Payment</p>
          <p className="font-medium capitalize text-dark">
            {order.payment_method} &middot; {order.payment_status}
          </p>
        </div>

        <div>
          <p className="text-dark/60">Order Status</p>
          <p className="font-medium capitalize text-dark">{order.order_status}</p>
        </div>

        <div className="sm:col-span-3">
          <p className="text-dark/60">Shipping Address</p>
          <p className="font-medium text-dark">{order.shipping_address}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-black/10 bg-white dark:border-white/10 dark:bg-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-background">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">Price</th>
                <th className="p-3">Qty</th>
                <th className="p-3">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-t border-black/10 dark:border-white/10">
                  <td className="p-3 text-dark">
                    {item.product_name}
                    {(item.variant_color || item.variant_size) && (
                      <span className="text-sm text-dark/60">
                        {" "}
                        ({[item.variant_color, item.variant_size].filter(Boolean).join(" / ")})
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-dark/70">{item.price.toFixed(0)} &#2547;</td>
                  <td className="p-3 text-dark/70">{item.quantity}</td>
                  <td className="p-3 text-dark/70">{item.subtotal.toFixed(0)} &#2547;</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="ml-auto max-w-sm space-y-2 rounded-xl border border-black/10 bg-white p-6 text-right dark:border-white/10 dark:bg-white/5">
        <p className="flex justify-between">
          <span>Subtotal</span>
          <span>{order.subtotal.toFixed(0)} &#2547;</span>
        </p>
        <p className="flex justify-between">
          <span>Shipping</span>
          <span>{order.shipping_charge.toFixed(0)} &#2547;</span>
        </p>
        {order.discount_amount > 0 && (
          <p className="flex justify-between text-success">
            <span>Discount</span>
            <span>-{order.discount_amount.toFixed(0)} &#2547;</span>
          </p>
        )}
        <p className="flex justify-between border-t border-black/10 pt-2 text-lg font-bold dark:border-white/10">
          <span>Total</span>
          <span>{order.total_amount.toFixed(0)} &#2547;</span>
        </p>
      </div>
    </>
  );
}
