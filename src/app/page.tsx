import Link from "next/link";
import { CategoryCarousel } from "@/components/CategoryCarousel";
import { HeroSlider } from "@/components/HeroSlider";
import { PromoBanners } from "@/components/PromoBanners";
import { CategoryProductRow } from "@/components/CategoryProductRow";
import { TopSellingProductCard } from "@/components/TopSellingProductCard";
import { getHome } from "@/lib/queries";

export default async function HomePage() {
  const home = await getHome();
  // Banners without a position (older API) count as hero slides.
  const heroBanners = home.banners.filter((banner) => (banner.position ?? "hero") === "hero");
  const promoBanners = home.banners.filter((banner) => banner.position === "promo");

  return (
    <div>
      {heroBanners.length > 0 && (
        <section className="mx-auto max-w-[100rem] px-3 pt-4">
          <HeroSlider banners={heroBanners} />
        </section>
      )}

      {home.categories.length > 0 && (
        <section className="mx-auto max-w-[100rem] px-3 py-4">
          <div data-reveal className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-dark sm:text-3xl">Shop by Category</h2>
            <Link
              href="/products"
              className="text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80"
            >
              Explore All
            </Link>
          </div>

          <CategoryCarousel categories={home.categories} />
        </section>
      )}

      {home.best_sellers.length > 0 && (
        <section className="mx-auto max-w-[100rem] px-3 py-6">
          <h2 data-reveal className="mb-6 text-center text-2xl font-bold text-dark sm:text-3xl">Top Selling Products</h2>
          <div data-reveal-stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {home.best_sellers.slice(0, 4).map((product) => (
              <TopSellingProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <PromoBanners banners={promoBanners.slice(0, 2)} />

      <CategoryProductRow
        title="Flash Deals"
        viewAllHref="/products"
        products={home.flash_deals}
        firstItemBadge="Hot Deal"
      />

      <PromoBanners banners={promoBanners.slice(2, 4)} />

      <CategoryProductRow
        title="Featured Products"
        viewAllHref="/products"
        products={home.featured_products}
        firstItemBadge="New Arrival"
      />
    </div>
  );
}
