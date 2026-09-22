"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ProductListItem } from "@/lib/types";
import { isAuthenticated } from "@/lib/auth";
import { useQuickView } from "./QuickViewProvider";
import { toggleWishlist } from "@/lib/wishlist";
import { IconChevronDown, IconHeart, IconShoppingBag } from "./icons";

export function ProductCard({ product }: { product: ProductListItem }) {
  const router = useRouter();
  const { openQuickView } = useQuickView();
  const hasDiscount = product.discount_price !== null && product.discount_price < product.price;
  const discountPct = hasDiscount ? Math.round((1 - product.discount_price! / product.price) * 100) : 0;

  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistBusy, setWishlistBusy] = useState(false);

  async function handleWishlistClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    setWishlistBusy(true);
    try {
      const res = await toggleWishlist(product.id);
      setWishlisted(res.wishlisted);
    } finally {
      setWishlistBusy(false);
    }
  }

  function handleQuickViewClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product.slug);
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white transition hover:shadow-lg dark:border-white/10 dark:bg-white/5"
    >
      <div className="relative aspect-4/5 w-full overflow-hidden bg-black/5 dark:bg-white/5">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : null}

        <button
          type="button"
          onClick={handleWishlistClick}
          disabled={wishlistBusy}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full shadow transition disabled:opacity-50 ${
            wishlisted ? "bg-danger text-white" : "bg-white/90 text-dark hover:text-danger dark:bg-black/60"
          }`}
        >
          <IconHeart className="h-4 w-4" />
        </button>

        {hasDiscount && (
          <span className="absolute right-2 top-2 rounded-full bg-danger px-2.5 py-1 text-xs font-semibold text-white">
            {discountPct}% OFF
          </span>
        )}

        {product.in_stock ? (
          <div className="absolute inset-x-2 bottom-2 flex items-center gap-2.5 rounded-xl bg-white/95 p-1.5 pr-3 shadow-lg backdrop-blur dark:bg-gray-900/90">
            <button
              type="button"
              onClick={handleQuickViewClick}
              aria-label="Quick view"
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-background shadow-md transition hover:scale-110 hover:shadow-lg active:scale-95"
            >
              <IconShoppingBag className="h-4.5 w-4.5" />
              <span className="absolute -right-1 -top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-danger text-white ring-2 ring-white dark:ring-gray-900">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="h-2.5 w-2.5">
                  <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </button>
            <span className="flex min-w-0 items-center gap-1.5 truncate text-xs font-semibold text-dark/70">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
              In Stock
            </span>
          </div>
        ) : (
          <div className="absolute inset-x-2 bottom-2 flex items-center justify-center gap-1.5 rounded-xl bg-white/95 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-dark/70 shadow-lg backdrop-blur dark:bg-gray-900/90">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-danger" />
            Out of Stock
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-2 text-sm font-semibold text-dark">{product.name}</p>
          <span className="shrink-0 text-xs text-dark/40">{product.sku}</span>
        </div>

        {product.colors_count > 1 && (
          <p className="flex items-center gap-1 text-xs text-dark/40">
            {product.colors_count} colors
            <IconChevronDown className="h-3 w-3" />
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          <span className="font-bold text-dark">
            {(hasDiscount ? product.discount_price! : product.price).toFixed(0)} &#2547;
          </span>
          {hasDiscount && (
            <>
              <span className="text-xs text-dark/40 line-through">{product.price.toFixed(0)} &#2547;</span>
              <span className="text-xs font-semibold text-danger">{discountPct}% OFF</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
