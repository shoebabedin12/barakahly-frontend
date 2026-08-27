import { apiPost } from "./api";

export function toggleWishlist(productId: number) {
  return apiPost<{ wishlisted: boolean }>(`/api/v1/wishlist/${productId}/toggle`);
}
