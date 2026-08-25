"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartProvider";

export function Header({ siteName, logo }: { siteName: string; logo: string | null }) {
  const { cart } = useCart();
  const count = cart?.count ?? 0;

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-background/95 backdrop-blur dark:border-white/10">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
          {logo ? (
            <Image src={logo} alt={siteName} width={36} height={36} className="h-9 w-9 rounded object-contain" />
          ) : null}
          <span className="text-lg">{siteName}</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-dark md:flex">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <Link href="/products" className="hover:text-primary">
            Shop
          </Link>
        </nav>

        <Link
          href="/cart"
          className="relative flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-background"
        >
          Cart
          {count > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1 text-xs font-bold text-dark">
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
