"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { useCart } from "./CartProvider";
import { IconHome, IconShoppingBag, IconUserCircle } from "./icons";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { cart, openCart } = useCart();
  const { customer } = useAuth();
  const count = cart?.count ?? 0;

  const items = [
    { href: "/", label: "Home", icon: IconHome, active: pathname === "/" },
    { href: "/products", label: "Shop", icon: IconShoppingBag, active: pathname.startsWith("/products") },
    { href: "/cart", label: "Cart", icon: IconShoppingBag, active: pathname.startsWith("/cart"), badge: count },
    {
      href: customer ? "/account" : "/login",
      label: "Profile",
      icon: IconUserCircle,
      active: pathname.startsWith("/account") || pathname === "/login",
    },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white sm:hidden dark:border-white/10 dark:bg-elevated"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-4">
        {items.map((item) => {
          const className = `relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition ${
            item.active ? "text-primary" : "text-dark/40"
          }`;
          const content = (
            <>
              <span className="relative">
                <item.icon className="h-6 w-6" />
                {!!item.badge && item.badge > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[9px] font-semibold text-white">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </span>
              {item.label}
            </>
          );

          if (item.label === "Cart") {
            return (
              <button key={item.label} type="button" onClick={openCart} className={className}>
                {content}
              </button>
            );
          }

          return (
            <Link key={item.label} href={item.href} className={className}>
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
