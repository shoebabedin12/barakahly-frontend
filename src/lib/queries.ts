import { apiGet } from "./api";
import type {
  CheckoutOptions,
  HomeData,
  Order,
  Paginated,
  ProductDetail,
  ProductListItem,
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

  return apiGet<Paginated<ProductListItem>>(`/api/v1/products${qs ? `?${qs}` : ""}`, {
    next: { revalidate: 60 },
  });
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
