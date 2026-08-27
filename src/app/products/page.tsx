import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import { getBrands, getCategories, getProducts } from "@/lib/queries";

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    brand?: string;
    min_price?: string;
    max_price?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  const [result, categories, brands] = await Promise.all([
    getProducts({
      search: params.search,
      category: params.category,
      brand: params.brand,
      min_price: params.min_price ? Number(params.min_price) : undefined,
      max_price: params.max_price ? Number(params.max_price) : undefined,
      sort: params.sort as never,
      page: params.page ? Number(params.page) : undefined,
      per_page: 24,
    }),
    getCategories(),
    getBrands(),
  ]);

  const hasActiveFilters = Boolean(
    params.search || params.category || params.brand || params.min_price || params.max_price
  );

  const buildHref = (page: number) => {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.category) query.set("category", params.category);
    if (params.brand) query.set("brand", params.brand);
    if (params.min_price) query.set("min_price", params.min_price);
    if (params.max_price) query.set("max_price", params.max_price);
    if (params.sort) query.set("sort", params.sort);
    query.set("page", String(page));
    return `/products?${query.toString()}`;
  };

  return (
    <div className="mx-auto max-w-[100rem] px-6 py-10">
      <nav className="mb-4 text-sm text-dark/40">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="mx-1">/</span>
        <span className="text-dark">Shop</span>
      </nav>

      <h1 className="text-3xl font-bold text-dark">Shop All</h1>

      <div className="mt-8">
        <ProductFilters
          categories={categories}
          brands={brands}
          priceBounds={result.price_range}
          current={{
            search: params.search,
            category: params.category,
            brand: params.brand,
            minPrice: params.min_price ? Number(params.min_price) : undefined,
            maxPrice: params.max_price ? Number(params.max_price) : undefined,
            sort: params.sort,
          }}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      <div className="mt-8">
        <p className="mb-6 text-sm text-dark/40">{result.meta.total} products found</p>

        {result.data.length === 0 ? (
          <p className="text-dark/40">No products found matching your filters.</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {result.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {result.meta.last_page > 1 && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {Array.from({ length: result.meta.last_page }, (_, i) => i + 1).map((page) => (
              <Link
                key={page}
                href={buildHref(page)}
                className={`h-9 min-w-9 rounded-full px-3 text-center text-sm leading-9 ${
                  page === result.meta.current_page
                    ? "bg-primary text-background"
                    : "border border-black/10 dark:border-white/10"
                }`}
              >
                {page}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
