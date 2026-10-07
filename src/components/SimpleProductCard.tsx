"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuickView } from "./QuickViewProvider";
import { IconShoppingBag } from "./icons";
import type { ProductListItem } from "@/lib/types";

export function SimpleProductCard({
  product,
  badge,
  fixedWidth = true,
}: {
  product: ProductListItem;
  badge?: string;
  /** True (default) for horizontal-scroll rows (CategoryProductRow) - the
   * card needs an explicit width there since it isn't in a grid. False for
   * grid layouts (e.g. the products listing page), where the card should
   * fill its grid cell instead. */
  fixedWidth?: boolean;
}) {
  const { openQuickView } = useQuickView();
  const hasDiscount = product.discount_price !== null && product.discount_price < product.price;
  const price = hasDiscount ? product.discount_price! : product.price;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    openQuickView(product.slug, "cart");
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className={`lift group relative flex flex-col overflow-hidden rounded-xl border border-black/10 bg-white p-4 hover:shadow-lg dark:border-white/10 dark:bg-white/5 ${
        fixedWidth ? "w-50 shrink-0 sm:w-55" : "w-full"
      }`}
    >
      {badge && (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold text-dark">
          {badge}
        </span>
      )}

      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-black/5 dark:bg-white/5">
        {product.image && (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="220px"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        )}
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-dark">{product.name}</p>

      <div className="mt-1.5 flex items-baseline gap-2">
        <span className="font-bold text-secondary">{price.toFixed(0)} &#2547;</span>
        {hasDiscount && (
          <span className="text-xs text-dark/40 line-through">{product.price.toFixed(0)} &#2547;</span>
        )}
      </div>

      <button
        type="button"
        onClick={handleAddToCart}
        className="mt-3 flex items-center justify-center gap-1.5 rounded-lg border border-secondary py-2 text-xs font-semibold text-secondary transition hover:bg-secondary/10"
      >
        <IconShoppingBag className="h-3.5 w-3.5" />
        Add To Cart
      </button>
    </Link>
  );
}
