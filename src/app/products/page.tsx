import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/queries";

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    brand?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  const result = await getProducts({
    search: params.search,
    category: params.category,
    brand: params.brand,
    sort: params.sort as never,
    page: params.page ? Number(params.page) : undefined,
    per_page: 24,
  });

  const buildHref = (page: number) => {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.category) query.set("category", params.category);
    if (params.brand) query.set("brand", params.brand);
    if (params.sort) query.set("sort", params.sort);
    query.set("page", String(page));
    return `/products?${query.toString()}`;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-dark">
          {params.search ? `Results for "${params.search}"` : "All products"}
        </h1>

        <form className="flex gap-2" action="/products" method="get">
          <input
            type="search"
            name="search"
            defaultValue={params.search}
            placeholder="Search products..."
            className="w-full rounded-full border border-black/10 bg-white px-4 py-2 text-sm dark:border-white/10 dark:bg-white/5 sm:w-64"
          />
          <button
            type="submit"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-background"
          >
            Search
          </button>
        </form>
      </div>

      {result.data.length === 0 ? (
        <p className="py-16 text-center text-dark/60">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {result.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {result.meta.last_page > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
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
  );
}
