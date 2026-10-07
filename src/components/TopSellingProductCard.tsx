"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuickView } from "./QuickViewProvider";
import { IconShoppingBag } from "./icons";
import type { ProductListItem } from "@/lib/types";

export function TopSellingProductCard({ product }: { product: ProductListItem }) {
  const { openQuickView } = useQuickView();
  const hasDiscount = product.discount_price !== null && product.discount_price < product.price;
  const price = hasDiscount ? product.discount_price! : product.price;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    openQuickView(product.slug, "cart");
  }

  function handleBuyNow(e: React.MouseEvent) {
    e.preventDefault();
    openQuickView(product.slug, "buy");
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className="lift group relative flex items-center gap-5 overflow-hidden rounded-2xl border border-black/10 bg-white p-5 hover:shadow-lg dark:border-white/10 dark:bg-white/5"
    >
      <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-danger px-3 py-1 text-xs font-semibold text-white">
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
          <path d="M12 2c1.5 3 4 4.5 4 8a4 4 0 1 1-8 0c0-.7.15-1.3.4-1.9C9 9.5 8.5 11 8.5 12.2A3.5 3.5 0 0 0 12 15.7a3.5 3.5 0 0 0 3.5-3.5c0-3-2-5-3.5-7.5-.7 1.2-1.7 2-2.6 2.9C8.5 8.5 8 9.5 8 10.5" />
        </svg>
        Best Selling
      </span>

      <div className="relative aspect-square h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-black/5 sm:h-36 sm:w-36 dark:bg-white/5">
        {product.image && (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="144px"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-base font-semibold text-dark sm:text-lg">{product.name}</p>

        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-lg font-bold text-secondary sm:text-xl">{price.toFixed(0)} &#2547;</span>
          {hasDiscount && (
            <span className="text-sm text-dark/40 line-through">{product.price.toFixed(0)} &#2547;</span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex items-center gap-1.5 rounded-full border border-secondary px-4 py-2 text-xs font-semibold text-secondary transition hover:bg-secondary/10 sm:text-sm"
          >
            <IconShoppingBag className="h-4 w-4" />
            Add To Cart
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            className="rounded-full bg-secondary px-4 py-2 text-xs font-semibold text-dark transition hover:opacity-90 sm:text-sm"
          >
            Buy now
          </button>
        </div>
      </div>
    </Link>
  );
}
