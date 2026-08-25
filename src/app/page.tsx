import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getHome } from "@/lib/queries";
import type { ProductListItem } from "@/lib/types";

function ProductSection({ title, products }: { title: string; products: ProductListItem[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <h2 className="mb-4 text-xl font-semibold text-dark">{title}</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default async function HomePage() {
  const home = await getHome();

  return (
    <div>
      {home.banners.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-6">
          <div className="overflow-hidden rounded-2xl">
            {home.banners.slice(0, 1).map((banner) => (
              <Link key={banner.id} href={banner.button_link ?? "/products"} className="block">
                <div className="relative aspect-[16/6] w-full bg-primary">
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
        <section className="mx-auto max-w-6xl px-4 py-8">
          <h2 className="mb-4 text-xl font-semibold text-dark">Shop by category</h2>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {home.categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className="flex flex-col items-center gap-2 rounded-xl border border-black/10 p-3 text-center hover:border-primary dark:border-white/10"
              >
                <div className="relative h-16 w-16 overflow-hidden rounded-full bg-black/5 dark:bg-white/5">
                  {category.cover_image && (
                    <Image src={category.cover_image} alt={category.name} fill className="object-cover" />
                  )}
                </div>
                <span className="line-clamp-1 text-xs font-medium">{category.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <ProductSection title="Flash deals" products={home.flash_deals} />
      <ProductSection title="Featured products" products={home.featured_products} />
      <ProductSection title="Best sellers" products={home.best_sellers} />
    </div>
  );
}
