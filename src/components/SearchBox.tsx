"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getSearchSuggestions } from "@/lib/queries";
import type { SearchSuggestion } from "@/lib/types";
import { IconMagnifyingGlass, IconXMark } from "./icons";

export function SearchBox({
  className,
  onNavigate,
  variant = "default",
}: {
  className?: string;
  onNavigate?: () => void;
  variant?: "default" | "bar";
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchSuggestion[] | null>(null);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trimmed = query.trim();

    const timer = setTimeout(() => {
      if (trimmed.length === 0) {
        setResults(null);
        setOpen(false);
        return;
      }

      getSearchSuggestions(trimmed)
        .then((items) => {
          setResults(items);
          setOpen(true);
        })
        .catch(() => {});
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOpen(false);
    onNavigate?.();
    router.push(`/products?search=${encodeURIComponent(query.trim())}`);
  }

  return (
    <div ref={containerRef} className={`relative ${className ?? ""}`}>
      <form onSubmit={handleSubmit} autoComplete="off">
        {variant === "bar" ? (
          <div className="flex items-center overflow-hidden rounded-full border border-black/10 bg-background/60 transition focus-within:border-primary dark:border-white/10">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => results && setOpen(true)}
              placeholder="Search in..."
              className="w-full bg-transparent py-2.5 pl-5 pr-2 text-sm text-dark placeholder:text-dark/40 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setResults(null);
                  setOpen(false);
                }}
                className="shrink-0 p-1 text-dark/40 hover:text-dark"
                title="Clear search"
              >
                <IconXMark className="h-4 w-4" />
              </button>
            )}
            <button
              type="submit"
              className="m-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-dark transition hover:opacity-90"
              title="Search"
            >
              <IconMagnifyingGlass className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center rounded-full border border-black/10 bg-background/60 px-4 py-2 transition focus-within:border-primary dark:border-white/10">
            <IconMagnifyingGlass className="h-4 w-4 shrink-0 text-dark/40" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => results && setOpen(true)}
              placeholder="Search products..."
              className="w-full bg-transparent px-3 text-sm text-dark placeholder:text-dark/40 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setResults(null);
                  setOpen(false);
                }}
                className="shrink-0 rounded-full p-1 text-dark/40 hover:text-dark"
                title="Clear search"
              >
                <IconXMark className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </form>

      {open && results && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-lg dark:border-white/10 dark:bg-gray-900">
          {results.length === 0 && <p className="px-4 py-3 text-sm text-dark/40">No products found.</p>}

          {results.map((item) => (
            <Link
              key={item.slug}
              href={`/products/${item.slug}`}
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
              className="flex items-center gap-3 px-4 py-2.5 transition hover:bg-background"
            >
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-background">
                {item.image && <Image src={item.image} alt={item.name} width={44} height={44} className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0">
                <p className="line-clamp-2 text-sm text-dark">{item.name}</p>
                <p className="text-xs text-dark/40">{item.price} &#2547;</p>
              </div>
            </Link>
          ))}

          {results.length > 0 && (
            <Link
              href={`/products?search=${encodeURIComponent(query.trim())}`}
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
              className="block border-t border-black/10 px-4 py-2.5 text-center text-sm font-medium text-primary hover:bg-background dark:border-white/10"
            >
              View all results for &quot;{query.trim()}&quot;
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
