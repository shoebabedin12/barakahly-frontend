"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { IconHeart } from "@/components/icons";
import { getWishlist } from "@/lib/queries";
import { toggleWishlist } from "@/lib/wishlist";
import type { ProductListItem } from "@/lib/types";

export default function AccountWishlistPage() {
  const [products, setProducts] = useState<ProductListItem[] | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    getWishlist().then(setProducts);
  }, []);

  async function handleRemove(productId: number) {
    setBusyId(productId);
    try {
      await toggleWishlist(productId);
      setProducts((prev) => prev?.filter((p) => p.id !== productId) ?? null);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-dark sm:text-3xl">Wishlist</h1>

      {products === null && <p className="text-sm text-dark/60">Loading...</p>}

      {products?.length === 0 && (
        <div className="rounded-2xl border border-black/10 bg-white py-16 text-center dark:border-white/10 dark:bg-white/5">
          <IconHeart className="mx-auto h-10 w-10 text-dark/20" />
          <p className="mt-3 text-dark/60">Your wishlist is empty.</p>
          <Link href="/products" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">
            Browse products &rarr;
          </Link>
        </div>
      )}

      {products && products.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard product={product} />
              <button
                onClick={() => handleRemove(product.id)}
                disabled={busyId === product.id}
                className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-danger shadow disabled:opacity-50 dark:bg-black/60"
                aria-label="Remove from wishlist"
              >
                <IconHeart className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
