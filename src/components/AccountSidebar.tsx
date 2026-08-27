"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { useCart } from "./CartProvider";
import { logout } from "@/lib/authApi";
import { IconHeart, IconLogout, IconShoppingBag, IconSquares, IconUserCircle } from "./icons";

const NAV_ITEMS = [
  { href: "/account", label: "Dashboard", icon: IconSquares },
  { href: "/account/orders", label: "My Orders", icon: IconShoppingBag },
  { href: "/account/wishlist", label: "Wishlist", icon: IconHeart },
  { href: "/account/profile", label: "Profile Settings", icon: IconUserCircle },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { customer, setCustomer } = useAuth();
  const { refreshCart } = useCart();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await logout();
    } catch {
      // token may already be invalid server-side - clear local state regardless
    } finally {
      setCustomer(null);
      await refreshCart();
      router.push("/");
    }
  }

  return (
    <div className="md:col-span-1">
      <div className="overflow-hidden rounded-2xl border border-black/10 bg-white dark:border-white/10 dark:bg-white/5">
        {customer && (
          <div className="flex items-center gap-3 border-b border-black/10 bg-background px-5 py-5 dark:border-white/10">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-background">
              {customer.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-dark">{customer.name}</p>
              <p className="truncate text-xs text-dark/60">{customer.phone}</p>
            </div>
          </div>
        )}

        <nav className="p-2">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === "/account" ? pathname === "/account" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                  isActive ? "bg-primary text-background" : "text-dark hover:bg-background dark:hover:bg-white/10"
                }`}
              >
                <item.icon className={`h-5 w-5 shrink-0 ${isActive ? "text-background" : "text-primary"}`} />
                {item.label}
              </Link>
            );
          })}

          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-danger transition hover:bg-danger/5 disabled:opacity-50"
          >
            <IconLogout className="h-5 w-5 shrink-0" />
            {signingOut ? "Signing out..." : "Logout"}
          </button>
        </nav>
      </div>
    </div>
  );
}
