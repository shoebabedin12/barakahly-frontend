"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { Category } from "@/lib/types";
import { IconChevronDown } from "./icons";

export function CategoryCarousel({ categories }: { categories: Category[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollBy(amount: number) {
    scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div ref={scrollRef} className="hide-scrollbar flex gap-6 overflow-x-auto scroll-smooth pb-2">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.slug}`}
            className="group flex w-28 shrink-0 flex-col items-center gap-3 text-center sm:w-36"
          >
            <div className="relative h-28 w-28 overflow-hidden rounded-full bg-black/5 transition group-hover:opacity-90 sm:h-36 sm:w-36 dark:bg-white/5">
              {category.cover_image && (
                <Image
                  src={category.cover_image}
                  alt={category.name}
                  fill
                  sizes="144px"
                  className="object-cover"
                />
              )}
            </div>
            <p className="text-xs font-bold uppercase tracking-wide text-dark sm:text-sm">{category.name}</p>
          </Link>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scrollBy(320)}
        aria-label="Scroll categories right"
        className="absolute right-0 top-12 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white shadow-md transition hover:bg-background sm:flex dark:border-white/10 dark:bg-gray-900"
      >
        <IconChevronDown className="h-4 w-4 -rotate-90 text-dark" />
      </button>

      <style>{`
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
