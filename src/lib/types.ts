export interface ProductListItem {
  id: number;
  name: string;
  slug: string;
  sku: string;
  price: number;
  discount_price: number | null;
  in_stock: boolean;
  stock: number;
  image: string | null;
  category: { id: number; name: string } | null;
  average_rating: number;
  reviews_count: number;
  has_variants: boolean;
  colors_count: number;
}

export interface ProductColor {
  id: number;
  name: string;
  hex_code: string | null;
  image: string | null;
}

export interface ProductSize {
  id: number;
  name: string;
}

export interface ProductVariant {
  id: number;
  color_id: number | null;
  size_id: number | null;
  price: number;
  discount_price: number | null;
  stock: number;
  image: string | null;
}

export interface ProductReview {
  id: number;
  customer_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface ProductDetail {
  id: number;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  price: number;
  discount_price: number | null;
  stock: number;
  in_stock: boolean;
  average_rating: number;
  reviews_count: number;
  category: { id: number; name: string } | null;
  brand: { id: number; name: string } | null;
  images: string[];
  colors: ProductColor[];
  sizes: ProductSize[];
  variants: ProductVariant[];
  reviews: ProductReview[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  cover_image: string | null;
  children?: Category[];
}

export interface Brand {
  id: number;
  name: string;
}

export interface Banner {
  id: number;
  title: string | null;
  subtitle: string | null;
  image: string;
  button_text: string | null;
  button_link: string | null;
}

export interface HomeData {
  banners: Banner[];
  categories: Category[];
  featured_products: ProductListItem[];
  flash_deals: ProductListItem[];
  best_sellers: ProductListItem[];
}

export interface Paginated<T> {
  data: T[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
  };
}

export interface ProductsResult extends Paginated<ProductListItem> {
  price_range: { min: number; max: number };
}

export interface CartItemEntry {
  id: number;
  product_id: number;
  product_variant_id: number | null;
  name: string;
  slug: string;
  sku: string;
  variant_color: string | null;
  variant_size: string | null;
  image: string | null;
  unit_price: number;
  original_price: number | null;
  quantity: number;
  max_stock: number;
  subtotal: number;
}

export interface CartResponse {
  items: CartItemEntry[];
  subtotal: number;
  count: number;
  guest_token: string | null;
}

export interface PaymentMethod {
  id: number;
  name: string;
  code: string;
  instructions: string | null;
  requires_transaction_id: boolean;
}

export interface ShippingZone {
  id: number;
  name: string;
  charge: string;
}

export interface CheckoutOptions {
  payment_methods: PaymentMethod[];
  shipping_zones: ShippingZone[];
}

export interface OrderItem {
  id: number;
  product_id: number | null;
  product_name: string;
  variant_color: string | null;
  variant_size: string | null;
  price: number;
  quantity: number;
  subtotal: number;
  image: string | null;
}

export interface Order {
  id: number;
  order_number: string;
  subtotal: number;
  shipping_charge: number;
  discount_amount: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  shipping_address: string;
  created_at: string;
  items: OrderItem[];
}

export interface Settings {
  site_name: string;
  site_logo: string | null;
  site_favicon: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
  shipping_charge: number;
  currency: string;
  facebook: string | null;
  instagram: string | null;
  youtube: string | null;
  whatsapp: string | null;
  meta_title: string | null;
  meta_description: string | null;
  flash_deal_ends_at: string | null;
  maintenance_mode: boolean;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  city: string | null;
  total_spent: number;
  orders_count: number;
  wishlist_count: number;
}

export interface ApiErrorBody {
  message: string;
  errors?: Record<string, string[]>;
}

export interface SearchSuggestion {
  name: string;
  slug: string;
  image: string | null;
  price: string;
}

export type LandingIconName =
  | "truck"
  | "shield"
  | "star"
  | "gift"
  | "leaf"
  | "sparkles"
  | "heart"
  | "bolt"
  | "home"
  | "book"
  | "tag"
  | "clock";

/** GET /api/v1/categories/:slug/landing on barakahly-api (NestJS). */
export interface CategoryLanding {
  category: { id: number; name: string; slug: string; description: string | null; productCount: number };
  theme: { accent: string; soft: string; ink: string; pattern: "none" | "dots" | "grid" | "arches" | "waves" };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaLabel: string;
    imageUrl: string | null;
    collage: string[];
  };
  highlights: { enabled: boolean; items: { icon: LandingIconName; title: string; text: string }[] };
  featured: { enabled: boolean; title: string; subtitle: string; products: ProductListItem[] };
  promo: {
    enabled: boolean;
    eyebrow: string;
    title: string;
    text: string;
    ctaLabel: string;
    ctaHref: string;
    imageUrl: string | null;
  };
  story: { enabled: boolean; title: string; text: string };
  subcategories: { id: number; name: string; slug: string }[];
}
