import { apiGet } from "./api";
import type {
  BlogPostDetail,
  BlogPostSummary,
  Brand,
  Category,
  CheckoutOptions,
  HomeData,
  Order,
  Paginated,
  ProductDetail,
  ProductListItem,
  ProductsResult,
  SearchSuggestion,
  Settings,
} from "./types";

export function getHome() {
  return apiGet<HomeData>("/api/v1/home", { next: { revalidate: 60 } });
}

export function getSettings() {
  return apiGet<{ data: Settings }>("/api/v1/settings", { next: { revalidate: 300 } }).then(
    (res) => res.data
  );
}

export interface ProductListParams {
  search?: string;
  category?: string | number;
  brand?: string | number;
  min_price?: number;
  max_price?: number;
  sort?: "price_asc" | "price_desc" | "name";
  per_page?: number;
  page?: number;
}

export function getProducts(params: ProductListParams = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  const qs = query.toString();

  return apiGet<ProductsResult>(`/api/v1/products${qs ? `?${qs}` : ""}`, {
    next: { revalidate: 60 },
  });
}

export function getBrands() {
  return apiGet<{ data: Brand[] }>("/api/v1/brands", { next: { revalidate: 300 } }).then((res) => res.data);
}

export function getProduct(slug: string) {
  return apiGet<{ data: ProductDetail }>(`/api/v1/products/${slug}`, {
    next: { revalidate: 60 },
  }).then((res) => res.data);
}

export function getCheckoutOptions() {
  return apiGet<CheckoutOptions>("/api/v1/checkout/options");
}

export function getOrder(id: number | string) {
  return apiGet<{ data: Order }>(`/api/v1/orders/${id}`).then((res) => res.data);
}

export function getOrders(page = 1) {
  return apiGet<Paginated<Order>>(`/api/v1/orders?page=${page}`);
}

export function getWishlist() {
  return apiGet<{ data: ProductListItem[] }>("/api/v1/wishlist").then((res) => res.data);
}

export function getCategories() {
  return apiGet<{ data: Category[] }>("/api/v1/categories", { next: { revalidate: 300 } }).then(
    (res) => res.data
  );
}

export function getCategoryPreview(categoryId: number) {
  return apiGet<SearchSuggestion[]>(`/api/v1/categories/${categoryId}/preview`);
}

export function getSearchSuggestions(query: string) {
  return apiGet<SearchSuggestion[]>(`/api/v1/search/suggestions?q=${encodeURIComponent(query)}`);
}

export function getBlogPosts(page = 1) {
  return apiGet<Paginated<BlogPostSummary>>(`/api/v1/blog?page=${page}`, { next: { revalidate: 120 } });
}

export function getBlogPost(slug: string) {
  return apiGet<{ data: BlogPostDetail }>(`/api/v1/blog/${slug}`, { next: { revalidate: 120 } }).then(
    (res) => res.data
  );
}
