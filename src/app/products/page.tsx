import Link from "next/link";
import { CategoryLandingStory, CategoryLandingTop } from "@/components/CategoryLanding";
import { SimpleProductCard } from "@/components/SimpleProductCard";
import { ProductFilters, ProductSortDropdown } from "@/components/ProductFilters";
import { IconChevronDown } from "@/components/icons";
import { getBrands, getCategories, getCategoryLanding, getProducts } from "@/lib/queries";

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
      per_page: 16,
    }),
    getCategories(),
    getBrands(),
  ]);

  // A category's landing design shows on its plain first page only; once the
  // shopper filters, sorts or pages, they just want the grid.
  const showLanding =
    params.category &&
    !params.search &&
    !params.brand &&
    !params.min_price &&
    !params.max_price &&
    !params.sort &&
    (!params.page || params.page === "1");
  const landing = showLanding ? await getCategoryLanding(params.category!) : null;

  const hasActiveFilters = Boolean(
    params.search || params.category || params.brand || params.min_price || params.max_price
  );

  const activeCategory = params.category
    ? categories.flatMap((category) => [category, ...(category.children ?? [])]).find(
        (category) => category.slug === params.category
      )
    : undefined;

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
      {landing && (
        <div className="mb-8">
          <CategoryLandingTop landing={landing} />
        </div>
      )}

      <div className={`mb-6 flex flex-wrap items-center justify-between gap-2 ${landing ? "hidden" : ""}`}>
        <h1 className="text-3xl font-bold text-dark">{activeCategory ? activeCategory.name : "Shop All"}</h1>

        <nav className="text-sm text-dark/40">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="mx-1.5">&rsaquo;</span>
          <span className="text-dark">{activeCategory ? activeCategory.name : "Shop"}</span>
        </nav>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
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

        <div className="min-w-0 flex-1">
          <div className="mb-6 flex items-center justify-between">
            <ProductSortDropdown current={{ sort: params.sort }} />
          </div>

          {result.data.length === 0 ? (
            <p className="text-dark/40">No products found matching your filters.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {result.data.map((product) => (
                <SimpleProductCard key={product.id} product={product} fixedWidth={false} />
              ))}
            </div>
          )}

          {result.meta.last_page > 1 && (
            <div className="mt-10 flex flex-col items-center gap-3">
              <div className="flex flex-wrap items-center justify-center gap-2">
                {result.meta.current_page > 1 && (
                  <Link
                    href={buildHref(result.meta.current_page - 1)}
                    aria-label="Previous page"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 dark:border-white/10"
                  >
                    <IconChevronDown className="h-3.5 w-3.5 rotate-90" />
                  </Link>
                )}

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

                {result.meta.current_page < result.meta.last_page && (
                  <Link
                    href={buildHref(result.meta.current_page + 1)}
                    aria-label="Next page"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 dark:border-white/10"
                  >
                    <IconChevronDown className="h-3.5 w-3.5 -rotate-90" />
                  </Link>
                )}
              </div>

              <p className="text-sm text-dark/40">
                Showing {result.meta.from ?? 0} - {result.meta.to ?? 0} of {result.meta.total} results
              </p>
            </div>
          )}
        </div>
      </div>

      {landing && <CategoryLandingStory landing={landing} />}
    </div>
  );
}
