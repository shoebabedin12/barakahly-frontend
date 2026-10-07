"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Banner } from "@/lib/types";

const INTERVAL_MS = 5500;

/** A title alone is just the artwork's name (it usually carries its own text); the overlay only shows for banners that add a subtitle or button. */
function BannerOverlay({ banner, first }: { banner: Banner; first: boolean }) {
  if (!banner.subtitle && !banner.button_text) return null;
  const Heading = first ? "h1" : "h2";
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-2 bg-gradient-to-r from-black/55 via-black/20 to-transparent p-8 text-white sm:p-14">
      {banner.title && <Heading className="max-w-lg text-2xl font-bold sm:text-4xl">{banner.title}</Heading>}
      {banner.subtitle && <p className="max-w-md text-sm text-white/85 sm:text-base">{banner.subtitle}</p>}
      {banner.button_text && (
        <span className="mt-2 inline-block w-fit rounded-full bg-secondary px-5 py-2 text-sm font-semibold text-[#1B1B1B]">
          {banner.button_text}
        </span>
      )}
    </div>
  );
}

/** Home hero: one banner as-is, several as an auto-advancing slider (pauses on hover/focus, swipeable, honours reduced motion). */
export function HeroSlider({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const count = banners.length;

  const go = useCallback((next: number) => setIndex((next + count) % count), [count]);

  useEffect(() => {
    if (count < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => go(index + 1), INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [index, paused, count, go]);

  if (count === 0) return null;

  return (
    <div
      className="group relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
      aria-roledescription="carousel"
    >
      <div className="relative aspect-16/6 w-full overflow-hidden rounded-2xl bg-primary">
        {banners.map((banner, i) => (
          <Link
            key={banner.id}
            href={banner.button_link || "/products"}
            aria-hidden={i !== index}
            tabIndex={i === index ? 0 : -1}
            className={`absolute inset-0 block transition-opacity duration-700 ease-out ${
              i === index ? "hero-active opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <Image
              src={banner.image}
              alt={banner.title ?? ""}
              fill
              priority={i === 0}
              sizes="(min-width: 1600px) 1600px, 100vw"
              className="object-cover"
            />
            <BannerOverlay banner={banner} first={i === 0} />
          </Link>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous banner"
            className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white opacity-0 backdrop-blur transition group-hover:opacity-100 hover:bg-black/55 sm:flex"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next banner"
            className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white opacity-0 backdrop-blur transition group-hover:opacity-100 hover:bg-black/55 sm:flex"
          >
            ›
          </button>
          <div className="mt-2.5 flex justify-center gap-1.5">
            {banners.map((banner, i) => (
              <button
                key={banner.id}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show banner ${i + 1}`}
                aria-current={i === index}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-secondary" : "w-1.5 bg-dark/25 hover:bg-dark/50"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
