"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { getOrders } from "@/lib/queries";
import type { Order, Paginated } from "@/lib/types";

export default function AccountOrdersPage() {
  return (
    <Suspense fallback={<p className="text-sm text-dark/60">Loading orders...</p>}>
      <OrdersContent />
    </Suspense>
  );
}

function OrdersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Number(searchParams.get("page") ?? "1");

  const [orders, setOrders] = useState<Paginated<Order> | null>(null);

  useEffect(() => {
    getOrders(page).then(setOrders);
  }, [page]);

  return (
    <>
      <h1 className="text-2xl font-bold text-dark sm:text-3xl">My Orders</h1>

      <div className="overflow-hidden rounded-xl border border-black/10 bg-white dark:border-white/10 dark:bg-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-background">
              <tr>
                <th className="p-3">Order #</th>
                <th className="p-3">Date</th>
                <th className="p-3">Total</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Status</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {orders && orders.data.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-dark/60">
                    No orders found.
                  </td>
                </tr>
              )}

              {orders?.data.map((order) => (
                <tr key={order.id} className="border-t border-black/10 dark:border-white/10">
                  <td className="p-3 font-medium text-dark">{order.order_number}</td>
                  <td className="p-3 text-dark/70">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="p-3 text-dark/70">{order.total_amount.toFixed(0)} &#2547;</td>
                  <td className="p-3 capitalize text-dark/70">{order.payment_status}</td>
                  <td className="p-3 capitalize text-dark/70">{order.order_status}</td>
                  <td className="p-3">
                    <Link href={`/account/orders/${order.id}`} className="text-primary hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {orders && orders.meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-4 text-sm">
          <button
            onClick={() => router.push(`/account/orders?page=${page - 1}`)}
            disabled={page <= 1}
            className="font-medium text-primary disabled:pointer-events-none disabled:text-dark/30"
          >
            Previous
          </button>
          <span className="text-dark/60">
            Page {orders.meta.current_page} of {orders.meta.last_page}
          </span>
          <button
            onClick={() => router.push(`/account/orders?page=${page + 1}`)}
            disabled={page >= orders.meta.last_page}
            className="font-medium text-primary disabled:pointer-events-none disabled:text-dark/30"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
