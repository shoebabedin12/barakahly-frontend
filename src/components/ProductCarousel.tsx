"use client";

import { useEffect, useRef, useState } from "react";
import { ProductCard } from "./ProductCard";
import { IconChevronDown } from "./icons";
import type { ProductListItem } from "@/lib/types";

export function ProductCarousel({ products }: { products: ProductListItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  function updateArrows() {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeftArrow(el.scrollLeft > 4);
    setShowRightArrow(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [products]);

  function scrollBy(amount: number) {
    scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <div className="relative">
      {showLeftArrow && (
        <button
          type="button"
          onClick={() => scrollBy(-320)}
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white shadow-md transition hover:bg-background sm:flex dark:border-white/10 dark:bg-gray-900"
        >
          <IconChevronDown className="h-4 w-4 rotate-90 text-dark" />
        </button>
      )}

      <div ref={scrollRef} className="hide-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-2">
        {products.map((product) => (
          <div key={product.id} className="w-1/2 shrink-0 sm:w-1/3 lg:w-1/4">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {showRightArrow && (
        <button
          type="button"
          onClick={() => scrollBy(320)}
          aria-label="Scroll right"
          className="absolute right-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white shadow-md transition hover:bg-background sm:flex dark:border-white/10 dark:bg-gray-900"
        >
          <IconChevronDown className="h-4 w-4 -rotate-90 text-dark" />
        </button>
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
    </div>
  );
}
