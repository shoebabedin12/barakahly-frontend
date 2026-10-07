"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SimpleProductCard } from "./SimpleProductCard";
import { IconChevronDown } from "./icons";
import type { ProductListItem } from "@/lib/types";

const ITEM_WIDTH = 236; // card width (220) + gap (16)
const ITEMS_PER_PAGE = 5;

export function CategoryProductRow({
  title,
  viewAllHref,
  products,
  firstItemBadge,
}: {
  title: string;
  viewAllHref: string;
  products: ProductListItem[];
  /** Label shown on the first product's card only (e.g. "New Arrival").
   * A plain string, not a function - this component is a Client Component
   * and page.tsx (a Server Component) can't pass it a function prop. */
  firstItemBadge?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE));

  function updatePage() {
    const el = scrollRef.current;
    if (!el) return;
    const pageWidth = ITEM_WIDTH * ITEMS_PER_PAGE;
    setPage(Math.round(el.scrollLeft / pageWidth));
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updatePage, { passive: true });
    return () => el.removeEventListener("scroll", updatePage);
  }, []);

  function scrollToPage(index: number) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: index * ITEM_WIDTH * ITEMS_PER_PAGE, behavior: "smooth" });
  }

  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-[100rem] px-3 py-6">
      <div data-reveal className="mb-4 flex items-end justify-between border-b border-black/10 pb-3 dark:border-white/10">
        <div>
          <h2 className="text-xl font-bold text-dark">{title}</h2>
          <span className="mt-1 block h-0.5 w-8 bg-secondary" />
        </div>
        <Link
          href={viewAllHref}
          className="flex shrink-0 items-center gap-1 text-xs font-semibold uppercase tracking-wide text-primary hover:underline"
        >
          View All Items
          <IconChevronDown className="h-3.5 w-3.5 -rotate-90" />
        </Link>
      </div>

      <div className="relative">
        <div ref={scrollRef} data-reveal-stagger className="hide-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-1 pt-1">
          {products.map((product, index) => (
            <SimpleProductCard key={product.id} product={product} badge={index === 0 ? firstItemBadge : undefined} />
          ))}
        </div>

        {products.length > ITEMS_PER_PAGE && (
          <button
            type="button"
            onClick={() => scrollRef.current?.scrollBy({ left: ITEM_WIDTH * 2, behavior: "smooth" })}
            aria-label={`Scroll ${title} right`}
            className="absolute right-0 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white shadow-md transition hover:bg-background sm:flex dark:border-white/10 dark:bg-elevated"
          >
            <IconChevronDown className="h-4 w-4 -rotate-90 text-dark" />
          </button>
        )}
      </div>

      {pageCount > 1 && (
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToPage(i)}
              aria-label={`Go to page ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === page ? "w-5 bg-secondary" : "w-1.5 bg-black/15 dark:bg-white/20"
              }`}
            />
          ))}
        </div>
      )}

      <style>{`
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
