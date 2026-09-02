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
  { value: "latest", label: "Default" },
  { value: "price_asc", label: "Ascending Price" },
  { value: "price_desc", label: "Descending Price" },
  { value: "name", label: "Name (A-Z)" },
];

type DropdownKey = "category" | "brand" | "price" | "sort" | null;

export function ProductFilters({ categories, brands, priceBounds, current, hasActiveFilters }: ProductFiltersProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState<DropdownKey>(null);
  const [search, setSearch] = useState(current.search ?? "");

  const range = priceBounds.max - priceBounds.min || 1;
  const minGap = Math.max(1, Math.round(range * 0.02));
  const [minPrice, setMinPrice] = useState(() =>
    Math.min(current.minPrice ?? priceBounds.min, priceBounds.max - minGap)
  );
  const [maxPrice, setMaxPrice] = useState(() =>
    Math.max(current.maxPrice ?? priceBounds.max, priceBounds.min + minGap)
  );

  const trackRef = useRef<HTMLDivElement>(null);
  const leftPct = ((minPrice - priceBounds.min) / range) * 100;
  const rightPct = ((maxPrice - priceBounds.min) / range) * 100;

  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.left = `${leftPct}%`;
      trackRef.current.style.right = `${100 - rightPct}%`;
    }
  }, [leftPct, rightPct]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(null);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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
    setOpen(null);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate({ search: search || undefined });
  }

  function applyPrice() {
    navigate({
      min_price: minPrice !== priceBounds.min ? String(minPrice) : undefined,
      max_price: maxPrice !== priceBounds.max ? String(maxPrice) : undefined,
    });
  }

  const sortLabel = SORT_OPTIONS.find((o) => o.value === (current.sort ?? "latest"))?.label ?? "Default";
  const allCategories = categories.flatMap((c) => [c, ...(c.children ?? [])]);
  const selectedCategoryName = allCategories.find((c) => String(c.id) === current.category)?.name;
  const selectedBrandName = brands.find((b) => String(b.id) === current.brand)?.name;

  const pillClass = (active: boolean) =>
    `flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition ${
      active
        ? "border-primary text-primary"
        : "border-black/15 text-dark hover:border-black/30 dark:border-white/20"
    }`;

  return (
    <div ref={containerRef} className="sticky top-16 z-30 flex flex-wrap items-center gap-2.5 rounded-2xl border border-black/10 bg-white/95 p-3 shadow-sm backdrop-blur dark:border-white/10 dark:bg-gray-900/95">
      <form onSubmit={handleSearchSubmit} className="min-w-40 flex-1">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full rounded-full border border-black/15 px-4 py-2 text-sm focus:border-primary focus:outline-none dark:border-white/20 dark:bg-white/5"
        />
      </form>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(open === "category" ? null : "category")}
          className={pillClass(!!current.category)}
        >
          {selectedCategoryName ?? "Category"}
          <IconChevronDown className={`h-3.5 w-3.5 transition-transform ${open === "category" ? "rotate-180" : ""}`} />
        </button>

        {open === "category" && (
          <div className="absolute left-0 top-full z-40 mt-2 w-64 rounded-2xl border border-black/10 bg-white p-4 shadow-lg dark:border-white/10 dark:bg-gray-900">
            <p className="mb-3 text-sm font-semibold text-dark">Select Category</p>
            <div className="max-h-64 space-y-1 overflow-y-auto">
              <OptionRow label="All Categories" selected={!current.category} onClick={() => navigate({ category: undefined })} />
              {categories.map((c) => (
                <div key={c.id}>
                  <OptionRow
                    label={c.name}
                    selected={current.category === String(c.id)}
                    onClick={() => navigate({ category: String(c.id) })}
                  />
                  {(c.children ?? []).map((child) => (
                    <OptionRow
                      key={child.id}
                      label={child.name}
                      indent
                      selected={current.category === String(child.id)}
                      onClick={() => navigate({ category: String(child.id) })}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {brands.length > 0 && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen(open === "brand" ? null : "brand")}
            className={pillClass(!!current.brand)}
          >
            {selectedBrandName ?? "Brand"}
            <IconChevronDown className={`h-3.5 w-3.5 transition-transform ${open === "brand" ? "rotate-180" : ""}`} />
          </button>

          {open === "brand" && (
            <div className="absolute left-0 top-full z-40 mt-2 w-64 rounded-2xl border border-black/10 bg-white p-4 shadow-lg dark:border-white/10 dark:bg-gray-900">
              <p className="mb-3 text-sm font-semibold text-dark">Select Brand</p>
              <div className="max-h-64 space-y-1 overflow-y-auto">
                <OptionRow label="All Brands" selected={!current.brand} onClick={() => navigate({ brand: undefined })} />
                {brands.map((b) => (
                  <OptionRow
                    key={b.id}
                    label={b.name}
                    selected={current.brand === String(b.id)}
                    onClick={() => navigate({ brand: String(b.id) })}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(open === "price" ? null : "price")}
          className={pillClass(current.minPrice !== undefined || current.maxPrice !== undefined)}
        >
          Price
          <IconChevronDown className={`h-3.5 w-3.5 transition-transform ${open === "price" ? "rotate-180" : ""}`} />
        </button>

        {open === "price" && (
          <div className="absolute left-0 top-full z-40 mt-2 w-72 rounded-2xl border border-black/10 bg-white p-4 shadow-lg dark:border-white/10 dark:bg-gray-900">
            <p className="mb-4 text-sm font-semibold text-dark">Select Price Range</p>

            <div className="relative pt-1">
              <div className="relative h-1 rounded-full bg-black/10 dark:bg-white/10">
                <div ref={trackRef} className="absolute h-1 rounded-full bg-dark dark:bg-white" />
              </div>
              <input
                type="range"
                min={priceBounds.min}
                max={priceBounds.max}
                value={minPrice}
                onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice - minGap))}
                className="price-range-input absolute inset-x-0 top-1 h-1 w-full bg-transparent"
              />
              <input
                type="range"
                min={priceBounds.min}
                max={priceBounds.max}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice + minGap))}
                className="price-range-input absolute inset-x-0 top-1 h-1 w-full bg-transparent"
              />
            </div>

            <div className="mt-5 flex items-center gap-3">
              <input
                type="number"
                value={minPrice}
                min={priceBounds.min}
                max={maxPrice - minGap}
                onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice - minGap))}
                className="w-full rounded-lg border border-black/15 px-2.5 py-1.5 text-sm dark:border-white/20 dark:bg-white/5"
              />
              <span className="text-dark/40">&ndash;</span>
              <input
                type="number"
                value={maxPrice}
                min={minPrice + minGap}
                max={priceBounds.max}
                onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice + minGap))}
                className="w-full rounded-lg border border-black/15 px-2.5 py-1.5 text-sm dark:border-white/20 dark:bg-white/5"
              />
            </div>

            <button
              type="button"
              onClick={applyPrice}
              className="mt-4 w-full rounded-full bg-primary py-2 text-sm font-semibold text-background transition hover:opacity-90"
            >
              Apply
            </button>
          </div>
        )}
      </div>

      <div className="relative ml-auto">
        <button
          type="button"
          onClick={() => setOpen(open === "sort" ? null : "sort")}
          className={pillClass(false)}
        >
          Sort: {sortLabel}
          <IconChevronDown className={`h-3.5 w-3.5 transition-transform ${open === "sort" ? "rotate-180" : ""}`} />
        </button>

        {open === "sort" && (
          <div className="absolute right-0 top-full z-40 mt-2 w-56 rounded-2xl border border-black/10 bg-white p-4 shadow-lg dark:border-white/10 dark:bg-gray-900">
            <p className="mb-3 text-sm font-semibold text-dark">Select Sort</p>
            <div className="space-y-1">
              {SORT_OPTIONS.map((option) => (
                <OptionRow
                  key={option.value}
                  label={option.label}
                  selected={(current.sort ?? "latest") === option.value}
                  onClick={() => navigate({ sort: option.value === "latest" ? undefined : option.value })}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={() => router.push("/products")}
          className="text-sm text-dark/40 underline-offset-2 hover:text-primary hover:underline"
        >
          Clear all
        </button>
      )}

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
          border-radius: 3px;
          background: var(--color-dark);
          cursor: pointer;
        }
        .price-range-input::-moz-range-thumb {
          pointer-events: auto;
          width: 14px;
          height: 14px;
          border: none;
          border-radius: 3px;
          background: var(--color-dark);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

function OptionRow({
  label,
  selected,
  onClick,
  indent,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  indent?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm text-dark transition hover:bg-background dark:hover:bg-white/5 ${
        indent ? "pl-6 text-dark/70" : ""
      }`}
    >
      <span
        className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border ${
          selected ? "border-dark bg-dark" : "border-black/25 dark:border-white/30"
        }`}
      >
        {selected && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="h-2.5 w-2.5 text-background">
            <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
          </svg>
        )}
      </span>
      {label}
    </button>
  );
}
