"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { Category } from "@/lib/types";
import { CarouselArrows, CarouselDots } from "./CarouselControls";
import { useScrollPager } from "./useScrollPager";

export function CategoryCarousel({ categories }: { categories: Category[] }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const pager = useScrollPager(rowRef, categories.length);

  return (
    <div className="relative">
      <div
        ref={rowRef}
        data-reveal-stagger
        className="hide-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 pt-1 [&>*]:snap-start"
      >
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.slug}`}
            className="group flex w-28 shrink-0 flex-col items-center gap-3 text-center sm:w-36"
          >
            <div className="relative h-28 w-28 overflow-hidden rounded-full bg-black/5 ring-secondary/0 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:ring-4 group-hover:ring-secondary/40 sm:h-36 sm:w-36 dark:bg-white/5">
              {category.cover_image && (
                <Image
                  src={category.cover_image}
                  alt={category.name}
                  fill
                  sizes="144px"
                  className="object-cover transition duration-500 group-hover:scale-110"
                />
              )}
            </div>
            <p className="text-xs font-bold uppercase tracking-wide text-dark sm:text-sm">{category.name}</p>
          </Link>
        ))}
      </div>

      <CarouselArrows
        label="categories"
        canPrev={pager.canPrev}
        canNext={pager.canNext}
        onPrev={pager.prev}
        onNext={pager.next}
        top="top-14 sm:top-[4.5rem]"
      />

      <CarouselDots label="Categories" page={pager.page} pageCount={pager.pageCount} onSelect={pager.goTo} />

    </div>
  );
}
