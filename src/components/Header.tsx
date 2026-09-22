"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthProvider";
import { useCart } from "./CartProvider";
import { useTheme } from "./ThemeProvider";
import { SearchBox } from "./SearchBox";
import {
  IconBars3,
  IconChevronDown,
  IconHeart,
  IconMagnifyingGlass,
  IconMoon,
  IconPhone,
  IconShoppingBag,
  IconSun,
  IconUser,
  IconXMark,
} from "./icons";
import { getCategoryPreview } from "@/lib/queries";
import type { Category, SearchSuggestion, Settings } from "@/lib/types";

export function Header({ settings, categories }: { settings: Settings | null; categories: Category[] }) {
  const pathname = usePathname();
  const { cart, openCart } = useCart();
  const { customer, loading: authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const count = cart?.count ?? 0;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [openCategoryId, setOpenCategoryId] = useState<number | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const triggerRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [previewCategoryId, setPreviewCategoryId] = useState<number | null>(null);
  const [preview, setPreview] = useState<SearchSuggestion[] | null>(null);
  const previewCache = useRef<Record<number, SearchSuggestion[]>>({});
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [expandedMobileCategoryId, setExpandedMobileCategoryId] = useState<number | null>(null);
  const navScrollRef = useRef<HTMLElement>(null);
  const [showNavLeftArrow, setShowNavLeftArrow] = useState(false);
  const [showNavRightArrow, setShowNavRightArrow] = useState(false);

  function updateNavArrows() {
    const el = navScrollRef.current;
    if (!el) return;
    setShowNavLeftArrow(el.scrollLeft > 4);
    setShowNavRightArrow(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }

  useEffect(() => {
    updateNavArrows();
    const el = navScrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateNavArrows, { passive: true });
    window.addEventListener("resize", updateNavArrows);
    return () => {
      el.removeEventListener("scroll", updateNavArrows);
      window.removeEventListener("resize", updateNavArrows);
    };
  }, [categories]);

  function scrollNavBy(amount: number) {
    navScrollRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  useEffect(() => {
    if (!searchOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [searchOpen]);

  // Close the mobile menu on navigation - adjusting state during render (rather
  // than in an effect) as recommended for state resets on prop change.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    if (openCategoryId === null || previewCategoryId === null) return;
    if (previewCache.current[previewCategoryId]) {
      setPreview(previewCache.current[previewCategoryId]);
      return;
    }
    setPreview(null);
    getCategoryPreview(previewCategoryId).then((items) => {
      previewCache.current[previewCategoryId] = items;
      setPreview(items);
    });
  }, [openCategoryId, previewCategoryId]);

  const MEGA_MENU_WIDTH = 768;

  function openMega(category: Category) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenCategoryId(category.id);
    setPreviewCategoryId(category.children?.[0]?.id ?? null);

    const trigger = triggerRefs.current[category.id];
    if (trigger) {
      const rect = trigger.getBoundingClientRect();
      const left = Math.max(
        16,
        Math.min(rect.left - 256, window.innerWidth - MEGA_MENU_WIDTH - 16)
      );
      setMenuPos({ top: rect.bottom + 16, left });
    }
  }

  function scheduleCloseMega() {
    closeTimer.current = setTimeout(() => setOpenCategoryId(null), 200);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white dark:border-white/10 dark:bg-gray-900">
      <div className="h-1 bg-linear-to-r from-secondary via-secondary/40 to-secondary" />

      {(settings?.contact_phone || settings?.contact_email) && (
        <div className="hidden bg-primary text-background sm:block">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-2 text-xs">
            <div className="flex items-center gap-5 text-background/80">
              {settings?.contact_phone && (
                <a href={`tel:${settings.contact_phone}`} className="flex items-center gap-1.5 hover:text-secondary">
                  <IconPhone className="h-3.5 w-3.5" />
                  {settings.contact_phone}
                </a>
              )}
              {settings?.contact_email && <span className="hidden lg:inline">{settings.contact_email}</span>}
            </div>
            <div className="flex items-center gap-4 text-background/80">
              <span>Cash on Delivery Available</span>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-4">
        <Link href="/" className="flex shrink-0 items-center">
          {settings?.site_logo ? (
            <div className="relative h-10 w-36">
              <Image
                src={settings.site_logo}
                alt={settings.site_name}
                fill
                sizes="144px"
                className="object-contain object-left"
              />
            </div>
          ) : (
            <span className="text-xl font-bold tracking-tight text-primary">{settings?.site_name ?? "Barakahly"}</span>
          )}
        </Link>

        <div className="relative hidden min-w-0 flex-1 lg:block">

          {showNavLeftArrow && (
            <button
              type="button"
              onClick={() => scrollNavBy(-220)}
              aria-label="Scroll navigation left"
              className="absolute left-0 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white shadow-md transition hover:bg-background dark:border-white/10 dark:bg-gray-900"
            >
              <IconChevronDown className="h-3.5 w-3.5 rotate-90 text-dark" />
            </button>
          )}

          <nav
            ref={navScrollRef}
            className={`hide-scrollbar flex items-center gap-6 overflow-x-auto whitespace-nowrap text-sm font-medium text-dark ${
              showNavLeftArrow ? "pl-8" : ""
            } ${showNavRightArrow ? "pr-8" : ""}`}
          >
          <Link href="/" className={`shrink-0 transition hover:text-primary ${pathname === "/" ? "text-primary" : ""}`}>
            Home
          </Link>

          {categories.map((category) => {
            const children = category.children ?? [];

            if (children.length === 0) {
              return (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className="shrink-0 transition hover:text-primary"
                >
                  {category.name}
                </Link>
              );
            }

            const isOpen = openCategoryId === category.id;

            return (
              <div
                key={category.id}
                ref={(el) => {
                  triggerRefs.current[category.id] = el;
                }}
                className="relative shrink-0"
                onMouseEnter={() => openMega(category)}
                onMouseLeave={scheduleCloseMega}
              >
                <Link
                  href={`/products?category=${category.slug}`}
                  className="flex items-center gap-1 transition hover:text-primary"
                >
                  {category.name}
                  <IconChevronDown className={`h-3.5 w-3.5 transition ${isOpen ? "rotate-180" : ""}`} />
                </Link>

                {isOpen && menuPos && (
                  <div className="fixed z-30" style={{ top: menuPos.top, left: menuPos.left, width: MEGA_MENU_WIDTH }}>
                    <div className="rounded-2xl border border-black/10 bg-white shadow-xl dark:border-white/10 dark:bg-gray-900">
                      <div className="flex gap-8 p-6">
                        <div className="w-56 shrink-0 border-r border-black/10 pr-6 dark:border-white/10">
                          <p className="mb-1 px-2 pt-1 text-xs font-semibold uppercase tracking-wider text-dark/40">{category.name}</p>
                          <div className="flex flex-col">
                            {children.map((child) => (
                              <Link
                                key={child.id}
                                href={`/products?category=${child.slug}`}
                                onMouseEnter={() => setPreviewCategoryId(child.id)}
                                className={`group flex items-center gap-3 rounded-xl px-2 py-2.5 text-sm transition hover:bg-background ${
                                  previewCategoryId === child.id ? "bg-background text-primary" : "text-dark"
                                }`}
                              >
                                <span
                                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background text-primary transition group-hover:bg-primary group-hover:text-background ${
                                    previewCategoryId === child.id ? "bg-primary text-background" : ""
                                  }`}
                                >
                                  <IconShoppingBag className="h-4.5 w-4.5" />
                                </span>
                                <span className="min-w-0 leading-snug">{child.name}</span>
                              </Link>
                            ))}
                          </div>
                          <Link
                            href={`/products?category=${category.slug}`}
                            className="mt-2 block border-t border-black/10 pt-3 text-center text-sm font-medium text-primary hover:underline dark:border-white/10"
                          >
                            View All &rarr;
                          </Link>
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-dark/40">Popular in this category</p>
                          {!preview && <p className="text-sm text-dark/40">Loading...</p>}
                          {preview && preview.length === 0 && <p className="text-sm text-dark/40">No products in this category yet.</p>}
                          {preview && preview.length > 0 && (
                            <div className="grid grid-cols-4 gap-5">
                              {preview.map((item) => (
                                <Link key={item.slug} href={`/products/${item.slug}`} className="group/preview">
                                  <div className="aspect-square overflow-hidden rounded-xl bg-background">
                                    {item.image && (
                                      <Image src={item.image} alt={item.name} width={120} height={120} className="h-full w-full object-cover transition duration-300 group-hover/preview:scale-105" />
                                    )}
                                  </div>
                                  <p className="mt-2 truncate text-sm text-dark">{item.name}</p>
                                  <p className="text-xs text-dark/40">{item.price} &#2547;</p>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <Link href="/blog" className={`shrink-0 transition hover:text-primary ${pathname.startsWith("/blog") ? "text-primary" : ""}`}>
            Blog
          </Link>
          <Link href="/contact" className={`shrink-0 transition hover:text-primary ${pathname === "/contact" ? "text-primary" : ""}`}>
            Contact
          </Link>
          </nav>

          {showNavRightArrow && (
            <button
              type="button"
              onClick={() => scrollNavBy(220)}
              aria-label="Scroll navigation right"
              className="absolute right-0 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white shadow-md transition hover:bg-background dark:border-white/10 dark:bg-gray-900"
            >
              <IconChevronDown className="h-3.5 w-3.5 -rotate-90 text-dark" />
            </button>
          )}
        </div>

        <div ref={searchRef} className="relative hidden lg:block">
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-background dark:hover:bg-white/10"
            title="Search"
          >
            <IconMagnifyingGlass className="h-5 w-5" />
          </button>

          {searchOpen && (
            <div className="absolute right-0 top-full z-40 mt-2 w-md rounded-2xl border border-black/10 bg-white p-3 shadow-lg dark:border-white/10 dark:bg-gray-900">
              <SearchBox onNavigate={() => setSearchOpen(false)} />
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1 text-dark">
          <button
            type="button"
            onClick={toggleTheme}
            title="Toggle dark mode"
            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-background dark:hover:bg-white/10"
          >
            {theme === "dark" ? <IconSun className="h-5 w-5" /> : <IconMoon className="h-5 w-5" />}
          </button>

          {!authLoading && customer && (
            <>
              <Link href="/account/wishlist" title="Wishlist" className="hidden h-10 w-10 items-center justify-center rounded-full transition hover:bg-background sm:flex">
                <IconHeart className="h-5 w-5" />
              </Link>

              <div className="group relative hidden sm:block">
                <button className="flex h-10 items-center gap-1.5 rounded-full px-2 transition hover:bg-background">
                  <IconUser className="h-5 w-5" />
                </button>
                <div className="absolute right-0 top-full z-20 hidden pt-2 group-hover:block">
                  <div className="w-48 rounded-xl border border-black/10 bg-white py-2 shadow-lg dark:border-white/10 dark:bg-gray-900">
                    <p className="truncate px-4 pb-2 pt-1 text-xs font-medium text-dark/40">{customer.name}</p>
                    <Link href="/account" className="block px-4 py-2 text-sm hover:bg-background">My Account</Link>
                    <Link href="/account/orders" className="block px-4 py-2 text-sm hover:bg-background">My Orders</Link>
                    <Link href="/account/wishlist" className="block px-4 py-2 text-sm hover:bg-background">Wishlist</Link>
                  </div>
                </div>
              </div>
            </>
          )}

          {!authLoading && !customer && (
            <Link href="/login" title="Login" className="hidden h-10 w-10 items-center justify-center rounded-full transition hover:bg-background sm:flex">
              <IconUser className="h-5 w-5" />
            </Link>
          )}

          <button
            type="button"
            onClick={openCart}
            title="Cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-background"
          >
            <IconShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute right-0 top-0 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold text-dark">
                {count}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-background lg:hidden"
          >
            {mobileOpen ? <IconXMark className="h-5 w-5" /> : <IconBars3 className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="space-y-4 border-t border-black/10 px-5 py-5 dark:border-white/10 lg:hidden">
          <SearchBox onNavigate={() => setMobileOpen(false)} />

          <nav className="flex flex-col gap-1 text-sm font-medium">
            <Link href="/" className="rounded-lg px-2 py-2 hover:bg-background">Home</Link>
            <Link href="/cart" className="rounded-lg px-2 py-2 hover:bg-background">Cart</Link>
            <Link href="/blog" className="rounded-lg px-2 py-2 hover:bg-background">Blog</Link>
            <Link href="/contact" className="rounded-lg px-2 py-2 hover:bg-background">Contact</Link>

            {categories.length > 0 && (
              <>
                <p className="mt-2 px-2 text-xs font-semibold uppercase tracking-wider text-dark/40">Categories</p>
                {categories.map((category) => {
                  const children = category.children ?? [];
                  const isExpanded = expandedMobileCategoryId === category.id;

                  return (
                    <div key={category.id}>
                      <div className="flex items-center gap-1 rounded-lg pr-1 text-dark/70 hover:bg-background">
                        <Link href={`/products?category=${category.slug}`} className="flex flex-1 items-center gap-3 px-2 py-2">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background text-primary">
                            <IconShoppingBag className="h-4 w-4" />
                          </span>
                          {category.name}
                        </Link>

                        {children.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setExpandedMobileCategoryId(isExpanded ? null : category.id)}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-background"
                            aria-label={`Toggle ${category.name} subcategories`}
                          >
                            <IconChevronDown className={`h-4 w-4 transition ${isExpanded ? "rotate-180" : ""}`} />
                          </button>
                        )}
                      </div>

                      {isExpanded && (
                        <div className="ml-11 flex flex-col border-l border-black/10 pl-3 dark:border-white/10">
                          {children.map((child) => (
                            <Link
                              key={child.id}
                              href={`/products?category=${child.slug}`}
                              className="rounded-lg px-2 py-2 text-sm text-dark/70 hover:bg-background"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}

            {customer ? (
              <>
                <Link href="/account" className="rounded-lg px-2 py-2 hover:bg-background">My Account</Link>
                <Link href="/account/orders" className="rounded-lg px-2 py-2 hover:bg-background">My Orders</Link>
                <Link href="/account/wishlist" className="rounded-lg px-2 py-2 hover:bg-background">Wishlist</Link>
              </>
            ) : (
              <>
                <Link href="/login" className="rounded-lg px-2 py-2 hover:bg-background">Login</Link>
                <Link href="/register" className="rounded-lg px-2 py-2 hover:bg-background">Register</Link>
              </>
            )}
          </nav>
        </div>
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
    </header>
  );
}
