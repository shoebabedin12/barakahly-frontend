"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "./CartProvider";
import { addToCart } from "@/lib/cart";
import { ApiError } from "@/lib/api";
import { recordRecentlyViewed } from "@/lib/recentlyViewed";
import { IconCheckCircle, IconChevronDown } from "./icons";
import type { ProductDetail as ProductDetailType } from "@/lib/types";

export function ProductDetail({ product }: { product: ProductDetailType }) {
  const { refreshCart, openCart } = useCart();

  useEffect(() => {
    recordRecentlyViewed(product.slug);
  }, [product.slug]);

  const [colorId, setColorId] = useState<number | null>(product.colors[0]?.id ?? null);
  const [sizeId, setSizeId] = useState<number | null>(product.sizes[0]?.id ?? null);
  const [quantity, setQuantity] = useState(1);
  // null = follow the selected color/variant's own image; a number = the visitor
  // explicitly picked a thumbnail or nav arrow, which overrides that until the color changes again.
  const [manualImage, setManualImage] = useState<number | null>(null);
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message?: string }>({
    type: "idle",
  });
  const [submitting, setSubmitting] = useState(false);

  const hasVariants = product.variants.length > 0;

  const selectedVariant = useMemo(() => {
    if (!hasVariants) return null;
    return (
      product.variants.find(
        (variant) =>
          (product.colors.length === 0 || variant.color_id === colorId) &&
          (product.sizes.length === 0 || variant.size_id === sizeId)
      ) ?? null
    );
  }, [hasVariants, product.variants, product.colors.length, product.sizes.length, colorId, sizeId]);

  const selectedColor = useMemo(
    () => product.colors.find((color) => color.id === colorId) ?? null,
    [product.colors, colorId]
  );

  // A size-specific variant photo wins over the color's own photo, which wins over the gallery order.
  const colorImage = selectedVariant?.image ?? selectedColor?.image ?? null;
  const colorImageIndex = colorImage ? product.images.indexOf(colorImage) : -1;
  const activeImage =
    manualImage ?? (colorImage ? (colorImageIndex >= 0 ? colorImageIndex : -1) : 0);
  const mainImage = manualImage !== null ? product.images[manualImage] : colorImage ?? product.images[0];

  const price = selectedVariant?.price ?? product.discount_price ?? product.price;
  const originalPrice = selectedVariant?.price ? null : product.discount_price ? product.price : null;
  const stock = hasVariants ? selectedVariant?.stock ?? 0 : product.stock;
  const canAddToCart = hasVariants ? selectedVariant !== null && stock > 0 : stock > 0;

  async function handleAddToCart() {
    setSubmitting(true);
    setStatus({ type: "idle" });

    try {
      await addToCart(product.id, selectedVariant?.id, quantity);
      await refreshCart();
      setStatus({ type: "success", message: "Added to cart." });
      openCart();
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof ApiError ? error.message : "Could not add to cart.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:grid-cols-2">
      <div className="flex gap-4">
        {product.images.length > 1 && (
          <div className="flex shrink-0 flex-col gap-3">
            {product.images.map((image, index) => (
              <button
                key={image}
                onClick={() => setManualImage(index)}
                className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 transition sm:h-20 sm:w-20 ${
                  index === activeImage
                    ? "border-secondary"
                    : "border-black/10 hover:border-black/30 dark:border-white/10"
                }`}
              >
                <Image src={image} alt="" fill sizes="80px" className="object-cover" />
                {index === activeImage && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-dark">
                    <IconCheckCircle className="h-3 w-3" />
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        <div className="relative aspect-square w-full flex-1 overflow-hidden rounded-xl bg-black/5 dark:bg-white/5">
          {mainImage && (
            <Image
              key={mainImage}
              src={mainImage}
              alt={product.name}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-contain"
              priority
            />
          )}

          {product.images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() =>
                  setManualImage(
                    (Math.max(activeImage, 0) - 1 + product.images.length) % product.images.length
                  )
                }
                aria-label="Previous image"
                className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-dark shadow-md transition hover:bg-white dark:bg-gray-900/90 dark:text-background"
              >
                <IconChevronDown className="h-4 w-4 rotate-90" />
              </button>
              <button
                type="button"
                onClick={() => setManualImage((Math.max(activeImage, 0) + 1) % product.images.length)}
                aria-label="Next image"
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-dark shadow-md transition hover:bg-white dark:bg-gray-900/90 dark:text-background"
              >
                <IconChevronDown className="h-4 w-4 -rotate-90" />
              </button>
            </>
          )}
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-semibold text-dark">{product.name}</h1>

        {product.reviews_count > 0 && (
          <p className="mt-1 text-sm text-dark/60">
            &#9733; {product.average_rating.toFixed(1)} ({product.reviews_count} reviews)
          </p>
        )}

        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-2xl font-bold text-primary">{price.toFixed(0)} &#2547;</span>
          {originalPrice && (
            <span className="text-base text-dark/50 line-through">{originalPrice.toFixed(0)} &#2547;</span>
          )}
        </div>

        {product.colors.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-sm font-medium text-dark">Color</p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => {
                    setColorId(color.id);
                    setManualImage(null);
                  }}
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
          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-dark">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size.id}
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

        <div className="mt-6">
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
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="flex h-11 w-11 cursor-pointer items-center justify-center text-lg font-medium text-dark transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-white/10"
                aria-label="Decrease quantity"
              >
                &minus;
              </button>
              <span className="w-10 text-center text-base font-semibold text-primary">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(stock || 1, q + 1))}
                disabled={quantity >= stock}
                className="flex h-11 w-11 cursor-pointer items-center justify-center text-lg font-medium text-dark transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-white/10"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!canAddToCart || submitting}
              className="flex-1 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-background disabled:opacity-50"
            >
              {submitting ? "Adding..." : "Add to cart"}
            </button>
          </div>

          {status.type !== "idle" && (
            <p className={`mt-3 text-sm ${status.type === "success" ? "text-success" : "text-danger"}`}>
              {status.message}
            </p>
          )}
        </div>

        {product.description && (
          <div className="mt-8 border-t border-black/10 pt-6 text-sm leading-relaxed text-dark/80 dark:border-white/10">
            <p className="mb-2 font-semibold text-dark">Description</p>
            <div
              className="[&_p]:mb-3 [&_a]:text-primary [&_a]:underline
                [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1
                [&_table]:mb-3 [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto [&_table]:border-collapse
                [&_td]:border [&_td]:border-black/10 [&_td]:p-2 [&_td]:align-top dark:[&_td]:border-white/10
                [&_img]:my-4 [&_img]:rounded-xl"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
