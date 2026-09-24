import Image from "next/image";
import Link from "next/link";
import { CategoryCarousel } from "@/components/CategoryCarousel";
import { CategoryProductRow } from "@/components/CategoryProductRow";
import { TopSellingProductCard } from "@/components/TopSellingProductCard";
import { getHome } from "@/lib/queries";

export default async function HomePage() {
  const home = await getHome();

  return (
    <div>
      {home.banners.length > 0 && (
        <section className="mx-auto max-w-[100rem] px-3 pt-4">
          <div className="overflow-hidden rounded-2xl">
            {home.banners.slice(0, 1).map((banner) => (
              <Link key={banner.id} href={banner.button_link ?? "/products"} className="block">
                <div className="relative aspect-16/6 w-full bg-primary">
                  <Image src={banner.image} alt={banner.title ?? ""} fill className="object-cover" priority />
                  <div className="absolute inset-0 flex flex-col justify-center gap-2 bg-black/30 p-8 text-background">
                    {banner.title && <h1 className="text-2xl font-bold sm:text-4xl">{banner.title}</h1>}
                    {banner.subtitle && <p className="max-w-md text-sm sm:text-base">{banner.subtitle}</p>}
                    {banner.button_text && (
                      <span className="mt-2 inline-block w-fit rounded-full bg-secondary px-5 py-2 text-sm font-semibold text-dark">
                        {banner.button_text}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {home.categories.length > 0 && (
        <section className="mx-auto max-w-[100rem] px-3 py-4">
          <div className="mb-4 flex items-center justify-between">
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
          <h2 className="mb-6 text-center text-2xl font-bold text-dark sm:text-3xl">Top Selling Products</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {home.best_sellers.slice(0, 4).map((product) => (
              <TopSellingProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <CategoryProductRow
        title="Flash Deals"
        viewAllHref="/products"
        products={home.flash_deals}
        firstItemBadge="Hot Deal"
      />

      <CategoryProductRow
        title="Featured Products"
        viewAllHref="/products"
        products={home.featured_products}
        firstItemBadge="New Arrival"
      />
    </div>
  );
}
