"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Brand, Category } from "@/lib/types";
import { IconChevronDown } from "./icons";

interface ProductFiltersProps {
  categories: Category[];
  brands: Brand[];
  priceBounds: { min: number; max: number };
  current: {
    search?: string;
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  };
  hasActiveFilters: boolean;
}

const SORT_OPTIONS = [
  { value: "latest", label: "Default Sorting" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name", label: "Name (A-Z)" },
];

export function ProductFilters({ categories, brands, priceBounds, current, hasActiveFilters }: ProductFiltersProps) {
  const router = useRouter();

  const range = priceBounds.max - priceBounds.min || 1;
  const minGap = Math.max(1, Math.round(range * 0.02));
  const [minPrice, setMinPrice] = useState(() =>
    Math.min(current.minPrice ?? priceBounds.min, priceBounds.max - minGap)
  );
  const [maxPrice, setMaxPrice] = useState(() =>
    Math.max(current.maxPrice ?? priceBounds.max, priceBounds.min + minGap)
  );

  // Re-sync whenever the price bounds change (e.g. switching category swaps in a
  // new priceBounds prop without remounting this component) so the slider
  // doesn't keep stale values from the previous category's range. Adjusted
  // during render rather than in an effect, mirroring Header.tsx's
  // pathname-reset pattern.
  const boundsKey = `${priceBounds.min}-${priceBounds.max}-${current.minPrice}-${current.maxPrice}`;
  const [syncedBoundsKey, setSyncedBoundsKey] = useState(boundsKey);
  if (boundsKey !== syncedBoundsKey) {
    setSyncedBoundsKey(boundsKey);
    setMinPrice(Math.min(current.minPrice ?? priceBounds.min, priceBounds.max - minGap));
    setMaxPrice(Math.max(current.maxPrice ?? priceBounds.max, priceBounds.min + minGap));
  }

  const trackRef = useRef<HTMLDivElement>(null);
  const leftPct = ((minPrice - priceBounds.min) / range) * 100;
  const rightPct = ((maxPrice - priceBounds.min) / range) * 100;

  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.left = `${leftPct}%`;
      trackRef.current.style.right = `${100 - rightPct}%`;
    }
  }, [leftPct, rightPct]);

  function navigate(overrides: Record<string, string | undefined>) {
    const query = new URLSearchParams();
    const next = {
      search: current.search,
      category: current.category,
      brand: current.brand,
      min_price: current.minPrice !== undefined ? String(current.minPrice) : undefined,
      max_price: current.maxPrice !== undefined ? String(current.maxPrice) : undefined,
      sort: current.sort,
      ...overrides,
    };
    Object.entries(next).forEach(([key, value]) => {
      if (value) query.set(key, value);
    });
    const qs = query.toString();
    router.push(`/products${qs ? `?${qs}` : ""}`);
  }

  function applyPrice() {
    navigate({
      min_price: minPrice !== priceBounds.min ? String(minPrice) : undefined,
      max_price: maxPrice !== priceBounds.max ? String(maxPrice) : undefined,
    });
  }

  const allCategories = categories.flatMap((c) => [c, ...(c.children ?? [])]);

  return (
    <aside className="w-full shrink-0 lg:w-64">
      <FilterSection title="Filter By Category">
        <div className="space-y-1">
          <CheckboxRow label="All Categories" checked={!current.category} onChange={() => navigate({ category: undefined })} />
          {allCategories.map((c) => (
            <CheckboxRow
              key={c.id}
              label={c.name}
              checked={current.category === c.slug}
              onChange={() => navigate({ category: current.category === c.slug ? undefined : c.slug })}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price Range">
        <div className="relative pt-1">
          <div className="relative h-1 rounded-full bg-black/10 dark:bg-white/10">
            <div ref={trackRef} className="absolute h-1 rounded-full bg-secondary" />
          </div>
          <input
            type="range"
            min={priceBounds.min}
            max={priceBounds.max}
            value={minPrice}
            onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice - minGap))}
            onMouseUp={applyPrice}
            onTouchEnd={applyPrice}
            className="price-range-input absolute inset-x-0 top-1 h-1 w-full bg-transparent"
          />
          <input
            type="range"
            min={priceBounds.min}
            max={priceBounds.max}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice + minGap))}
            onMouseUp={applyPrice}
            onTouchEnd={applyPrice}
            className="price-range-input absolute inset-x-0 top-1 h-1 w-full bg-transparent"
          />
        </div>

        <div className="mt-5 flex items-center justify-between text-sm text-dark/70">
          <span>&#2547; {minPrice.toLocaleString()}</span>
          <span>&#2547; {maxPrice.toLocaleString()}</span>
        </div>

        <style>{`
          .price-range-input {
            -webkit-appearance: none;
            appearance: none;
            pointer-events: none;
            margin: 0;
          }
          .price-range-input::-webkit-slider-runnable-track {
            -webkit-appearance: none;
            background: transparent;
          }
          .price-range-input::-moz-range-track {
            background: transparent;
          }
          .price-range-input::-webkit-slider-thumb {
            -webkit-appearance: none;
            pointer-events: auto;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: var(--color-secondary);
            border: 2px solid white;
            box-shadow: 0 0 0 1px rgba(0,0,0,0.15);
            cursor: pointer;
          }
          .price-range-input::-moz-range-thumb {
            pointer-events: auto;
            width: 14px;
            height: 14px;
            border: 2px solid white;
            box-shadow: 0 0 0 1px rgba(0,0,0,0.15);
            border-radius: 50%;
            background: var(--color-secondary);
            cursor: pointer;
          }
        `}</style>
      </FilterSection>

      {brands.length > 0 && (
        <FilterSection title="Brands">
          <div className="space-y-1">
            {brands.map((b) => (
              <CheckboxRow
                key={b.id}
                label={b.name}
                checked={current.brand === String(b.id)}
                onChange={() => navigate({ brand: current.brand === String(b.id) ? undefined : String(b.id) })}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {hasActiveFilters && (
        <button
          type="button"
          onClick={() => router.push("/products")}
          className="mt-2 text-sm text-dark/40 underline-offset-2 hover:text-primary hover:underline"
        >
          Clear all filters
        </button>
      )}
    </aside>
  );
}

export function ProductSortDropdown({ current }: { current: { sort?: string } }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const sortLabel = SORT_OPTIONS.find((o) => o.value === (current.sort ?? "latest"))?.label ?? "Default Sorting";

  function selectSort(value: string) {
    const url = new URL(window.location.href);
    if (value === "latest") {
      url.searchParams.delete("sort");
    } else {
      url.searchParams.set("sort", value);
    }
    router.push(`${url.pathname}${url.search}`);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-black/15 px-4 py-2.5 text-sm text-dark dark:border-white/20"
      >
        <span className="text-dark/50">Sort By:</span>
        {sortLabel}
        <IconChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-40 mt-2 w-56 rounded-xl border border-black/10 bg-white p-2 shadow-lg dark:border-white/10 dark:bg-elevated">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => selectSort(option.value)}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-background dark:hover:bg-white/5 ${
                (current.sort ?? "latest") === option.value ? "font-semibold text-primary" : "text-dark"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-b border-black/10 py-5 dark:border-white/10">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mb-3 flex w-full items-center justify-between text-left text-xs font-bold uppercase tracking-wide text-dark"
      >
        {title}
        <span className="text-base leading-none text-dark/50">{open ? "−" : "+"}</span>
      </button>
      {open && children}
    </div>
  );
}

function CheckboxRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex w-full items-center gap-2.5 rounded-lg py-1.5 text-left text-sm text-dark/80 transition hover:text-dark"
    >
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
          checked ? "border-secondary bg-secondary" : "border-black/25 dark:border-white/30"
        }`}
      >
        {checked && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="h-2.5 w-2.5 text-dark">
            <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
          </svg>
        )}
      </span>
      <span className="truncate">{label}</span>
    </button>
  );
}
