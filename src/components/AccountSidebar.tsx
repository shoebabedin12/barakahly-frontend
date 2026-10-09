"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { useCart } from "./CartProvider";
import { logout } from "@/lib/authApi";
import { IconHeart, IconLock, IconLogout, IconShoppingBag, IconSquares, IconUser } from "./icons";

const NAV_ITEMS = [
  { href: "/account/profile", label: "My Account", icon: IconUser },
  { href: "/account", label: "Dashboard", icon: IconSquares },
  { href: "/account/orders", label: "My Orders", icon: IconShoppingBag },
  { href: "/account/wishlist", label: "My Wishlist", icon: IconHeart },
  { href: "/account/password", label: "Change Password", icon: IconLock },
  { href: "/account/delete", label: "Delete Account", icon: IconLock },
];

/** The customer's photo, or the first letter of their name on the brand gradient. */
export function AccountAvatar({ name, src, className = "" }: { name: string; src?: string | null; className?: string }) {
  // Falls back to the initial if the photo can't be loaded.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  if (src && failedSrc !== src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- small user upload, no need for the image optimizer
      <img
        src={src}
        alt=""
        onError={() => setFailedSrc(src)}
        className={`shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-primary font-bold text-white ${className}`}
    >
      {name.trim().charAt(0).toUpperCase()}
    </div>
  );
}

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
    <aside className="flex flex-col gap-6 md:col-span-1">
      {customer && (
        <div className="flex items-center gap-4 rounded-sm bg-white px-6 py-5 dark:bg-white/5">
          <AccountAvatar name={customer.name} src={customer.avatar} className="h-14 w-14 text-xl" />
          <div className="min-w-0">
            <p className="text-sm text-dark/60">Hello</p>
            <p className="text-lg font-bold leading-snug break-words text-dark">{customer.name}</p>
          </div>
        </div>
      )}

      <nav className="flex flex-col overflow-hidden rounded-sm bg-white dark:bg-white/5">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === "/account" ? pathname === "/account" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3.5 border-b border-black/10 px-6 py-5 text-[15px] font-medium transition last:border-b-0 dark:border-white/10 ${
                isActive ? "bg-primary text-white" : "text-dark hover:bg-background dark:hover:bg-white/10"
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}

        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="flex items-center gap-3.5 px-6 py-5 text-left text-[15px] font-medium text-danger transition hover:bg-danger/5 disabled:opacity-50"
        >
          <IconLogout className="h-5 w-5 shrink-0" />
          {signingOut ? "Signing out..." : "Logout"}
        </button>
      </nav>
    </aside>
  );
}
