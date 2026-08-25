"use client";

import { apiDelete, apiGet, apiPatch, apiPost } from "./api";
import type { CartResponse } from "./types";

export function getCart() {
  return apiGet<CartResponse>("/api/v1/cart");
}

export function addToCart(productId: number, variantId?: number | null, quantity = 1) {
  return apiPost<CartResponse>("/api/v1/cart/items", {
    product_id: productId,
    variant_id: variantId ?? undefined,
    quantity,
  });
}

export function updateCartItem(cartItemId: number, quantity: number) {
  return apiPatch<CartResponse>(`/api/v1/cart/items/${cartItemId}`, { quantity });
}

export function removeCartItem(cartItemId: number) {
  return apiDelete<CartResponse>(`/api/v1/cart/items/${cartItemId}`);
}

export function clearCart() {
  return apiDelete<CartResponse>("/api/v1/cart");
}

export function applyCoupon(code: string) {
  return apiPost<{ code: string; discount: number }>("/api/v1/coupon/apply", {
    coupon_code: code,
  });
}
