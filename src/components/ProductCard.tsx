import Image from "next/image";
import Link from "next/link";
import type { ProductListItem } from "@/lib/types";

export function ProductCard({ product }: { product: ProductListItem }) {
  const hasDiscount = product.discount_price !== null && product.discount_price < product.price;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-black/10 bg-white transition hover:shadow-lg dark:border-white/10 dark:bg-white/5"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-black/5 dark:bg-white/5">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : null}

        {!product.in_stock && (
          <span className="absolute left-2 top-2 rounded-full bg-danger px-2 py-1 text-xs font-semibold text-white">
            Out of stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="line-clamp-2 text-sm font-medium text-dark">{product.name}</p>

        <div className="mt-auto flex items-center gap-2 pt-1">
          <span className="font-semibold text-primary">
            {(hasDiscount ? product.discount_price! : product.price).toFixed(0)} &#2547;
          </span>
          {hasDiscount && (
            <span className="text-xs text-dark/50 line-through">{product.price.toFixed(0)} &#2547;</span>
          )}
        </div>
      </div>
    </Link>
  );
}
