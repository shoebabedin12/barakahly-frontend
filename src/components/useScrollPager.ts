"use client";

import { type RefObject, useCallback, useEffect, useState } from "react";

export interface ScrollPager {
  page: number;
  pageCount: number;
  canPrev: boolean;
  canNext: boolean;
}

/**
 * Paging for a horizontally scrolling row, measured from the row itself:
 * a "page" is one visible width, so the dots and arrows stay right whatever
 * the card size or screen width. Re-measures on scroll, resize and content changes.
 */
export function useScrollPager(ref: RefObject<HTMLElement | null>, itemCount: number) {
  const [state, setState] = useState<ScrollPager>({ page: 0, pageCount: 1, canPrev: false, canNext: false });

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const width = el.clientWidth || 1;
    const max = Math.max(0, el.scrollWidth - width);
    const pageCount = max <= 4 ? 1 : Math.ceil(max / width) + 1;
    const atEnd = el.scrollLeft >= max - 4;
    const page = atEnd ? pageCount - 1 : Math.min(pageCount - 1, Math.round(el.scrollLeft / width));
    setState((prev) =>
      prev.page === page && prev.pageCount === pageCount && prev.canPrev === el.scrollLeft > 4 && prev.canNext === !atEnd
        ? prev
        : { page, pageCount, canPrev: el.scrollLeft > 4, canNext: !atEnd },
    );
  }, [ref]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, [ref, measure, itemCount]);

  const goTo = useCallback((page: number) => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    el.scrollTo({ left: Math.min(page * el.clientWidth, max), behavior: "smooth" });
  }, [ref]);

  const step = useCallback((direction: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    // A little under a full width, so the next card's edge lines up after the snap.
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: "smooth" });
  }, [ref]);

  const prev = useCallback(() => step(-1), [step]);
  const next = useCallback(() => step(1), [step]);

  return { ...state, goTo, prev, next };
}
