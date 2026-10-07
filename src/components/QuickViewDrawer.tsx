"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useQuickView } from "./QuickViewProvider";
import { useCart } from "./CartProvider";
import { addToCart } from "@/lib/cart";
import { ApiError } from "@/lib/api";
import { getProduct } from "@/lib/queries";
import type { ProductDetail } from "@/lib/types";
import { IconXMark } from "./icons";

export function QuickViewDrawer() {
  const { openSlug, intent, closeQuickView } = useQuickView();
  const { refreshCart, openCart } = useCart();
  const router = useRouter();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [colorId, setColorId] = useState<number | null>(null);
  const [sizeId, setSizeId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isOpen = openSlug !== null;

  useEffect(() => {
    if (!openSlug) return;

    let cancelled = false;

    Promise.resolve()
      .then(() => {
        if (cancelled) return;
        setProduct(null);
        setError(null);
        setSubmitError(null);
        setQuantity(1);
        return getProduct(openSlug);
      })
      .then((data) => {
        if (cancelled || !data) return;
        setProduct(data);
        setColorId(data.colors[0]?.id ?? null);
        setSizeId(data.sizes[0]?.id ?? null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Could not load this product.");
      });

    return () => {
      cancelled = true;
    };
  }, [openSlug]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeQuickView();
    }

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeQuickView]);

  const hasVariants = (product?.variants.length ?? 0) > 0;

  const selectedVariant = useMemo(() => {
    if (!product || !hasVariants) return null;
    return (
      product.variants.find(
        (variant) =>
          (product.colors.length === 0 || variant.color_id === colorId) &&
          (product.sizes.length === 0 || variant.size_id === sizeId)
      ) ?? null
    );
  }, [product, hasVariants, colorId, sizeId]);

  const price = selectedVariant?.price ?? product?.discount_price ?? product?.price ?? 0;
  const originalPrice = selectedVariant?.price ? null : product?.discount_price ? product.price : null;
  const stock = product ? (hasVariants ? selectedVariant?.stock ?? 0 : product.stock) : 0;
  const canAddToCart = product ? (hasVariants ? selectedVariant !== null && stock > 0 : stock > 0) : false;

  async function handleAddToCart() {
    if (!product) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await addToCart(product.id, selectedVariant?.id, quantity);
      await refreshCart();
      closeQuickView();
      if (intent === "buy") {
        router.push("/checkout");
      } else {
        openCart();
      }
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Could not add to cart.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div
        onClick={closeQuickView}
        aria-hidden="true"
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Quick view"
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl transition-transform duration-300 dark:bg-elevated ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 dark:border-white/10">
          <h2 className="text-lg font-semibold text-dark">Quick View</h2>
          <button
            type="button"
            onClick={closeQuickView}
            aria-label="Close quick view"
            className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-background dark:hover:bg-white/10"
          >
            <IconXMark className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 px-5 py-5">
          {error && <p className="text-sm text-danger">{error}</p>}

          {!error && !product && <p className="text-center text-sm text-dark/40">Loading...</p>}

          {product && (
            <div className="flex flex-col gap-5">
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-black/5 dark:bg-white/5">
                {product.images[0] && (
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="400px" />
                )}
              </div>

              <div>
                <Link
                  href={`/products/${product.slug}`}
                  onClick={closeQuickView}
                  className="text-lg font-semibold text-dark hover:text-primary"
                >
                  {product.name}
                </Link>

                {product.reviews_count > 0 && (
                  <p className="mt-1 text-sm text-dark/60">
                    &#9733; {product.average_rating.toFixed(1)} ({product.reviews_count} reviews)
                  </p>
                )}

                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-xl font-bold text-primary">{price.toFixed(0)} &#2547;</span>
                  {originalPrice && (
                    <span className="text-sm text-dark/50 line-through">{originalPrice.toFixed(0)} &#2547;</span>
                  )}
                </div>
              </div>

              {product.colors.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-medium text-dark">Color</p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => setColorId(color.id)}
                        className={`h-9 rounded-full border px-4 text-sm ${
                          colorId === color.id
                            ? "border-primary bg-primary text-background"
                            : "border-black/15 dark:border-white/20"
                        }`}
                      >
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.sizes.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-medium text-dark">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size.id}
                        type="button"
                        onClick={() => setSizeId(size.id)}
                        className={`h-9 min-w-9 rounded-full border px-3 text-sm ${
                          sizeId === size.id
                            ? "border-primary bg-primary text-background"
                            : "border-black/15 dark:border-white/20"
                        }`}
                      >
                        {size.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                {!canAddToCart ? (
                  <p className="mb-3 text-sm font-semibold text-danger">
                    {hasVariants && !selectedVariant ? "Please select the available options." : "Out of stock."}
                  </p>
                ) : (
                  <p className="mb-3 text-sm text-dark/60">{stock} in stock</p>
                )}

                <div className="flex items-center gap-3">
                  <div className="flex items-center overflow-hidden rounded-full border border-black/10 bg-background dark:border-white/15 dark:bg-white/5">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="flex h-11 w-11 cursor-pointer items-center justify-center text-lg font-medium text-dark transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-white/10"
                      aria-label="Decrease quantity"
                    >
                      &minus;
                    </button>
                    <span className="w-10 text-center text-base font-semibold text-primary">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(stock || 1, q + 1))}
                      disabled={quantity >= stock}
                      className="flex h-11 w-11 cursor-pointer items-center justify-center text-lg font-medium text-dark transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-white/10"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!canAddToCart || submitting}
                    className="flex-1 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-background disabled:opacity-50"
                  >
                    {submitting ? "Please wait..." : intent === "buy" ? "Buy Now" : "Add to Cart"}
                  </button>
                </div>

                {submitError && <p className="mt-3 text-sm text-danger">{submitError}</p>}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
