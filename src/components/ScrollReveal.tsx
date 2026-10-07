"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const SELECTOR = "[data-reveal]:not(.is-visible), [data-reveal-stagger]:not(.is-visible)";

/**
 * Fades sections in as they scroll into view (see the reveal rules in
 * globals.css). Stagger containers get a --i index on each child so cards
 * arrive one after another.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timers: number[] = [];
    // Once an entrance has played, drop the markers so the element's own
    // transitions (hover lift etc.) apply again without the stagger delay.
    const settle = (el: Element, delay: number) => {
      timers.push(
        window.setTimeout(() => {
          el.removeAttribute("data-reveal");
          el.removeAttribute("data-reveal-stagger");
        }, delay),
      );
    };

    const elements = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));
    elements.forEach((el) => {
      if (el.hasAttribute("data-reveal-stagger")) {
        Array.from(el.children).forEach((child, i) => (child as HTMLElement).style.setProperty("--i", String(i)));
      }
      // Already on screen: show as-is, no entrance (avoids a flash on load).
      const box = el.getBoundingClientRect();
      if (box.top < window.innerHeight && box.bottom > 0) {
        el.classList.add("is-visible");
        settle(el, 0);
      }
    });
    document.documentElement.classList.add("reveal-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
          settle(entry.target, 1400);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );
    elements.filter((el) => !el.classList.contains("is-visible")).forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [pathname]);

  return null;
}
