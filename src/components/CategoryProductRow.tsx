"use client";

import Link from "next/link";
import { useRef } from "react";
import { CarouselArrows, CarouselDots } from "./CarouselControls";
import { SimpleProductCard } from "./SimpleProductCard";
import { useScrollPager } from "./useScrollPager";
import { IconChevronDown } from "./icons";
import type { ProductListItem } from "@/lib/types";

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
  const rowRef = useRef<HTMLDivElement>(null);
  const pager = useScrollPager(rowRef, products.length);

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
        <div
          ref={rowRef}
          data-reveal-stagger
          className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1 pt-1 [&>*]:snap-start"
        >
          {products.map((product, index) => (
            <SimpleProductCard key={product.id} product={product} badge={index === 0 ? firstItemBadge : undefined} />
          ))}
        </div>

        <CarouselArrows
          label={title}
          canPrev={pager.canPrev}
          canNext={pager.canNext}
          onPrev={pager.prev}
          onNext={pager.next}
          top="top-[40%]"
        />
      </div>

      <CarouselDots label={title} page={pager.page} pageCount={pager.pageCount} onSelect={pager.goTo} />
    </section>
  );
}
