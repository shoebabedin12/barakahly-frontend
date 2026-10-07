"use client";

import type { CartResponse, Order, ProductDetail } from "./types";

type Fbq = (command: "track", event: string, params?: Record<string, unknown>) => void;

/** Sends a Facebook Pixel standard event, if the Pixel is configured and loaded. */
function track(event: string, params: Record<string, unknown>) {
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  if (typeof fbq === "function") fbq("track", event, { currency: "BDT", content_type: "product", ...params });
}

export function trackViewContent(product: ProductDetail) {
  track("ViewContent", {
    content_ids: [product.id],
    content_name: product.name,
    value: product.discount_price ?? product.price,
  });
}

/** AddToCart for the line that was just added, read back from the updated cart. */
export function trackAddToCart(cart: CartResponse, productId: number, variantId: number | null | undefined, quantity: number) {
  const line = cart.items.find(
    (item) => item.product_id === productId && (item.product_variant_id ?? null) === (variantId ?? null),
  );
  if (!line) return;
  track("AddToCart", {
    content_ids: [String(productId)],
    content_name: line.name,
    value: line.unit_price * quantity,
  });
}

export function trackInitiateCheckout(cart: CartResponse) {
  if (!cart.items.length) return;
  track("InitiateCheckout", {
    content_ids: cart.items.map((item) => item.product_id),
    value: cart.subtotal,
    num_items: cart.count,
  });
}

/** Purchase, once per order on this browser (the confirmation page can be reloaded). */
export function trackPurchase(order: Order) {
  const key = `fb_purchase_${order.order_number}`;
  try {
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, "1");
  } catch {
    // storage blocked - still report the purchase once for this page view
  }
  track("Purchase", {
    value: order.total_amount,
    content_ids: (order.items ?? []).map((item) => item.product_id).filter(Boolean),
  });
}

export function trackPageView() {
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  if (typeof fbq === "function") fbq("track", "PageView");
}
