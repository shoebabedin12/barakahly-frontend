"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { IconBanknotes, IconEnvelope, IconHeart, IconPhone, IconShoppingBag } from "@/components/icons";
import { getOrders } from "@/lib/queries";
import type { Order } from "@/lib/types";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-success/15 text-success",
  cancelled: "bg-danger/15 text-danger",
};

export default function AccountDashboardPage() {
  const { customer } = useAuth();
  const [recentOrders, setRecentOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    getOrders(1)
      .then((res) => setRecentOrders(res.data.slice(0, 5)))
      .catch(() => setRecentOrders([]));
  }, []);

  if (!customer) return null;

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-dark sm:text-3xl">My Account</h1>
        <p className="mt-1 text-sm text-dark/60">Welcome back, {customer.name}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-white/5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-dark/60">Total Spent</p>
              <h3 className="mt-2 text-xl font-bold text-dark">{customer.total_spent.toFixed(0)} &#2547;</h3>
            </div>
            <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
              <IconBanknotes className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-white/5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-dark/60">Total Orders</p>
              <h3 className="mt-2 text-xl font-bold text-dark">{customer.orders_count}</h3>
            </div>
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
              <IconShoppingBag className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-white/5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-dark/60">Wishlist Items</p>
              <h3 className="mt-2 text-xl font-bold text-dark">{customer.wishlist_count}</h3>
            </div>
            <div className="rounded-xl bg-danger/10 p-2.5 text-danger">
              <IconHeart className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
        <h2 className="mb-4 text-lg font-bold text-dark">Account Info</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-background p-2.5 text-primary">
              <IconPhone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-dark/60">Phone</p>
              <p className="text-sm font-medium text-dark">{customer.phone}</p>
            </div>
          </div>

          {customer.email && (
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-background p-2.5 text-primary">
                <IconEnvelope className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-dark/60">Email</p>
                <p className="text-sm font-medium text-dark">{customer.email}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-white/5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-dark">Recent Orders</h2>
          <Link href="/account/orders" className="text-sm font-medium text-primary hover:underline">
            View All &rarr;
          </Link>
        </div>

        {recentOrders === null && <p className="text-sm text-dark/60">Loading...</p>}

        {recentOrders?.length === 0 && (
          <div className="py-10 text-center">
            <IconShoppingBag className="mx-auto h-10 w-10 text-dark/20" />
            <p className="mt-3 text-dark/60">You have not placed any orders yet.</p>
            <Link href="/products" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">
              Start Shopping &rarr;
            </Link>
          </div>
        )}

        {recentOrders && recentOrders.length > 0 && (
          <div className="divide-y divide-black/10 dark:divide-white/10">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex flex-wrap items-center justify-between gap-3 px-3 py-4 transition first:pt-0 last:pb-0 hover:bg-background"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-background p-2.5 text-primary">
                    <IconShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-dark">{order.order_number}</p>
                    <p className="text-sm text-dark/60">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <p className="font-semibold text-dark">{order.total_amount.toFixed(0)} &#2547;</p>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                      STATUS_STYLES[order.order_status] ?? "bg-black/5 text-dark/70"
                    }`}
                  >
                    {order.order_status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
