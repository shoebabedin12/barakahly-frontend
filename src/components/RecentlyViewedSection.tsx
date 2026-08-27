"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "./ProductCard";
import { getProduct } from "@/lib/queries";
import { getRecentlyViewedSlugs } from "@/lib/recentlyViewed";
import type { ProductDetail, ProductListItem } from "@/lib/types";

function toListItem(p: ProductDetail): ProductListItem {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    price: p.price,
    discount_price: p.discount_price,
    in_stock: p.in_stock,
    stock: p.stock,
    image: p.images[0] ?? null,
    category: p.category,
    average_rating: p.average_rating,
    reviews_count: p.reviews_count,
    has_variants: p.variants.length > 0,
    colors_count: p.colors.length,
  };
}

export function RecentlyViewedSection({ excludeSlugs = [] }: { excludeSlugs?: string[] }) {
  const [products, setProducts] = useState<ProductListItem[] | null>(null);

  useEffect(() => {
    const slugs = getRecentlyViewedSlugs(excludeSlugs).slice(0, 8);

    if (slugs.length === 0) {
      Promise.resolve().then(() => setProducts([]));
      return;
    }

    Promise.allSettled(slugs.map((slug) => getProduct(slug))).then((results) => {
      const found = results
        .filter((r): r is PromiseFulfilledResult<ProductDetail> => r.status === "fulfilled")
        .map((r) => toListItem(r.value));
      setProducts(found);
    });
    // excludeSlugs is derived fresh each render from cart contents; only slug identity matters here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!products || products.length === 0) return null;

  return (
    <section className="py-6">
      <h2 className="mb-4 text-xl font-semibold text-dark">Recently Viewed</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
