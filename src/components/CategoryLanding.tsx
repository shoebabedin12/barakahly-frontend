import Image from "next/image";
import Link from "next/link";
import { SimpleProductCard } from "./SimpleProductCard";
import type { CategoryLanding, LandingIconName } from "@/lib/types";

// Heroicons (outline) - same set as the admin panel's landing editor.
const ICON_PATHS: Record<LandingIconName, string> = {
  truck:
    "M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.38a1.13 1.13 0 0 1-1.13-1.13V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.13c.62 0 1.13-.5 1.1-1.12a17.9 17.9 0 0 0-3.21-9.26 2.06 2.06 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.18v-.96c0-.57-.42-1.05-.98-1.11a48.8 48.8 0 0 0-10.04 0A1.1 1.1 0 0 0 2.25 6.6v7.65m12-6.68v6.68m0 0H2.25",
  shield:
    "M9 12.75 11.25 15 15 9.75m-3-7.04A11.96 11.96 0 0 1 3.6 6 12 12 0 0 0 3 9.75c0 5.6 3.82 10.3 9 11.62 5.18-1.33 9-6.03 9-11.62 0-1.31-.21-2.57-.6-3.75h-.15c-3.2 0-6.1-1.25-8.25-3.29Z",
  star: "M11.48 3.5a.56.56 0 0 1 1.04 0l2.13 5.11c.08.2.27.33.48.35l5.52.44c.5.04.7.66.32.99l-4.2 3.6a.56.56 0 0 0-.18.56l1.28 5.38a.56.56 0 0 1-.84.61l-4.72-2.88a.56.56 0 0 0-.59 0l-4.72 2.88a.56.56 0 0 1-.84-.61l1.28-5.38a.56.56 0 0 0-.18-.56l-4.2-3.6a.56.56 0 0 1 .32-.99l5.52-.44c.21-.02.4-.15.48-.35L11.48 3.5Z",
  gift: "M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.88A2.63 2.63 0 1 0 9.38 7.5H12m0-2.63V7.5m0-2.63a2.63 2.63 0 1 1 2.63 2.63H12m-8.63 3.75h17.26c.62 0 1.12-.5 1.12-1.13v-1.5c0-.62-.5-1.12-1.12-1.12H3.37c-.62 0-1.12.5-1.12 1.12v1.5c0 .63.5 1.13 1.12 1.13Z",
  leaf: "M12 21c-4.97 0-9-4.03-9-9 0-5.25 4.5-9 12-9h6v6c0 7.5-3.75 12-9 12Zm0 0c0-4.5 2.25-8.25 6-10.5",
  sparkles:
    "M9.81 15.9 9 18.75l-.81-2.85a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.85-.81a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.81 2.85a4.5 4.5 0 0 0 3.09 3.09l2.85.81-2.85.81a4.5 4.5 0 0 0-3.09 3.09ZM18.26 8.72 18 9.75l-.26-1.03a3.38 3.38 0 0 0-2.46-2.46L14.25 6l1.03-.26a3.38 3.38 0 0 0 2.46-2.46L18 2.25l.26 1.03a3.38 3.38 0 0 0 2.46 2.46l1.03.26-1.03.26a3.38 3.38 0 0 0-2.46 2.46Z",
  heart:
    "M21 8.25c0-2.49-2.1-4.5-4.69-4.5-1.93 0-3.6 1.12-4.31 2.73-.72-1.6-2.38-2.73-4.31-2.73C5.1 3.75 3 5.76 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z",
  bolt: "m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z",
  home: "m2.25 12 8.95-8.95c.44-.44 1.15-.44 1.59 0L21.75 12M4.5 9.75v10.13c0 .62.5 1.12 1.13 1.12H9.75v-4.88c0-.62.5-1.12 1.13-1.12h2.25c.62 0 1.12.5 1.12 1.12V21h4.13c.62 0 1.12-.5 1.12-1.12V9.75M8.25 21h8.25",
  book: "M12 6.04A8.97 8.97 0 0 0 6 3.75c-1.05 0-2.06.18-3 .51v14.25A9 9 0 0 1 6 18c2.3 0 4.4.87 6 2.29m0-14.25a8.97 8.97 0 0 1 6-2.29c1.05 0 2.06.18 3 .51v14.25A9 9 0 0 0 18 18a8.97 8.97 0 0 0-6 2.29m0-14.25v14.25",
  tag: "M9.57 3H5.25A2.25 2.25 0 0 0 3 5.25v4.32c0 .6.24 1.17.66 1.6l9.58 9.57c.7.7 1.8.87 2.65.33a18.1 18.1 0 0 0 5.22-5.22c.54-.86.37-1.95-.33-2.65L11.16 3.66A2.25 2.25 0 0 0 9.57 3ZM6 6h.01v.01H6V6Z",
  clock: "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
};

function LandingIcon({ name, className }: { name: LandingIconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d={ICON_PATHS[name]} />
    </svg>
  );
}

function patternImage(pattern: CategoryLanding["theme"]["pattern"], color: string): string {
  const c = encodeURIComponent(color);
  const svg = (body: string, size: number) =>
    `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'%3E${body}%3C/svg%3E")`;

  switch (pattern) {
    case "dots":
      return svg(`%3Ccircle cx='2' cy='2' r='1.6' fill='${c}' fill-opacity='.18'/%3E`, 22);
    case "grid":
      return svg(`%3Cpath d='M32 0H0v32' fill='none' stroke='${c}' stroke-opacity='.12'/%3E`, 32);
    case "arches":
      return svg(
        `%3Cpath d='M4 48V26a20 20 0 0 1 40 0v22' fill='none' stroke='${c}' stroke-opacity='.14' stroke-width='1.5'/%3E`,
        48
      );
    case "waves":
      return svg(
        `%3Cpath d='M0 20c10-8 20-8 30 0s20 8 30 0' fill='none' stroke='${c}' stroke-opacity='.16' stroke-width='1.5'/%3E`,
        60
      );
    default:
      return "none";
  }
}

function themeStyle(theme: CategoryLanding["theme"]) {
  return {
    "--lp-accent": theme.accent,
    "--lp-soft": theme.soft,
    "--lp-ink": theme.ink,
  } as React.CSSProperties;
}

function HeroMedia({ landing }: { landing: CategoryLanding }) {
  const { hero, category } = landing;

  if (hero.imageUrl) {
    return (
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-xl shadow-black/10">
        <Image src={hero.imageUrl} alt={category.name} fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
      </div>
    );
  }

  const [first, second, third] = hero.collage;
  if (!first) {
    return (
      <div className="relative mx-auto aspect-square w-3/4">
        <div className="absolute inset-0 rounded-full bg-(--lp-accent) opacity-15" />
        <div className="absolute inset-[18%] rounded-full bg-(--lp-accent) opacity-25" />
      </div>
    );
  }

  const tile = "absolute overflow-hidden rounded-3xl border-[6px] border-(--lp-bg) bg-white shadow-xl shadow-black/15";

  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <div className="absolute inset-[8%] rounded-full bg-(--lp-accent) opacity-10" />
      <div className={`${tile} left-0 top-[4%] h-[62%] w-[62%] -rotate-3`}>
        <Image src={first} alt="" fill priority sizes="(min-width: 1024px) 28vw, 60vw" className="object-cover" />
      </div>
      {second && (
        <div className={`${tile} bottom-0 right-0 h-[56%] w-[56%] rotate-3`}>
          <Image src={second} alt="" fill sizes="(min-width: 1024px) 25vw, 55vw" className="object-cover" />
        </div>
      )}
      {third && (
        <div className={`${tile} right-[4%] top-0 h-[34%] w-[34%] rotate-6`}>
          <Image src={third} alt="" fill sizes="(min-width: 1024px) 15vw, 35vw" className="object-cover" />
        </div>
      )}
    </div>
  );
}

/** Everything above the shared filters + product grid. */
export function CategoryLandingTop({ landing }: { landing: CategoryLanding }) {
  const { category, theme, hero, highlights, featured, promo, subcategories } = landing;
  const highlightItems = highlights.items.filter((item) => item.title);

  return (
    <div className="category-landing flex flex-col gap-10 sm:gap-14" style={themeStyle(theme)}>
      <section
        className="relative overflow-hidden rounded-[2rem] bg-(--lp-bg)"
        style={{ backgroundImage: patternImage(theme.pattern, theme.accent) }}
      >
        <div className="grid items-center gap-10 px-6 py-10 sm:px-12 sm:py-14 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:px-16 lg:py-16">
          <div>
            <nav className="mb-6 text-sm text-dark/50">
              <Link href="/" className="hover:text-(--lp-accent)">Home</Link>
              <span className="mx-1.5">&rsaquo;</span>
              <span className="text-dark/80">{category.name}</span>
            </nav>

            {hero.eyebrow && (
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/70 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-(--lp-accent) shadow-sm dark:bg-white/10">
                <span className="h-1.5 w-1.5 rounded-full bg-(--lp-accent)" />
                {hero.eyebrow}
              </span>
            )}

            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-(--lp-heading) sm:text-5xl lg:text-6xl">
              {hero.title || category.name}
            </h1>

            {hero.subtitle && (
              <p className="mt-5 max-w-xl text-base leading-relaxed text-dark/70 sm:text-lg">{hero.subtitle}</p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#products"
                className="inline-flex items-center gap-2 rounded-full bg-(--lp-accent) px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:brightness-110"
              >
                {hero.ctaLabel || "Shop now"}
                <span aria-hidden>→</span>
              </a>
              <span className="text-sm font-medium text-dark/60">
                {category.productCount} {category.productCount === 1 ? "product" : "products"}
              </span>
            </div>
          </div>

          <HeroMedia landing={landing} />
        </div>
      </section>

      {highlights.enabled && highlightItems.length > 0 && (
        <section
          className={`grid gap-4 sm:grid-cols-2 ${highlightItems.length >= 4 ? "lg:grid-cols-4" : highlightItems.length === 3 ? "lg:grid-cols-3" : ""}`}
        >
          {highlightItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-(--lp-bg) text-(--lp-accent)">
                <LandingIcon name={item.icon} className="h-6 w-6" />
              </span>
              <div>
                <p className="font-semibold text-dark">{item.title}</p>
                {item.text && <p className="text-sm text-dark/55">{item.text}</p>}
              </div>
            </div>
          ))}
        </section>
      )}

      {subcategories.length > 0 && (
        <section className="flex flex-wrap gap-2.5">
          {subcategories.map((sub) => (
            <Link
              key={sub.id}
              href={`/products?category=${sub.slug}`}
              className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-medium text-dark transition hover:border-(--lp-accent) hover:text-(--lp-accent) dark:border-white/10 dark:bg-white/5"
            >
              {sub.name}
            </Link>
          ))}
        </section>
      )}

      {featured.enabled && featured.products.length > 0 && (
        <section>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-(--lp-heading) sm:text-3xl">{featured.title}</h2>
              {featured.subtitle && <p className="mt-1.5 text-dark/60">{featured.subtitle}</p>}
            </div>
            <a href="#products" className="text-sm font-semibold text-(--lp-accent) hover:underline">
              View all {category.name} →
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.products.map((product) => (
              <SimpleProductCard key={product.id} product={product} fixedWidth={false} />
            ))}
          </div>
        </section>
      )}

      {promo.enabled && promo.title && (
        <section className="relative overflow-hidden rounded-[2rem] bg-(--lp-accent) text-white">
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-white/5" />
          <div className="relative grid items-center gap-8 px-6 py-10 sm:px-12 md:grid-cols-[1.3fr_1fr] lg:px-16">
            <div>
              {promo.eyebrow && (
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-white/75">{promo.eyebrow}</span>
              )}
              <h2 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl">{promo.title}</h2>
              {promo.text && <p className="mt-3 max-w-lg text-white/80">{promo.text}</p>}
              {promo.ctaLabel && (
                <Link
                  href={promo.ctaHref || "#products"}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-(--lp-accent) transition hover:bg-white/90"
                >
                  {promo.ctaLabel} <span aria-hidden>→</span>
                </Link>
              )}
            </div>
            {promo.imageUrl && (
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image src={promo.imageUrl} alt="" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
              </div>
            )}
          </div>
        </section>
      )}

      <div id="products" className="scroll-mt-28 border-t border-black/10 pt-10 dark:border-white/10">
        <h2 className="text-2xl font-bold text-dark sm:text-3xl">All {category.name}</h2>
      </div>
    </div>
  );
}

/** Optional SEO/story paragraph, rendered below the product grid. */
export function CategoryLandingStory({ landing }: { landing: CategoryLanding }) {
  const { story, theme } = landing;
  if (!story.enabled || !(story.title || story.text)) return null;

  return (
    <section className="category-landing mt-16 rounded-3xl bg-(--lp-bg) px-6 py-10 sm:px-12" style={themeStyle(theme)}>
      <div className="max-w-3xl">
        {story.title && <h2 className="text-2xl font-bold text-(--lp-heading)">{story.title}</h2>}
        {story.text && (
          <div className="mt-4 space-y-3 leading-relaxed text-dark/70">
            {story.text.split(/\n{2,}/).map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
