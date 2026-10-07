import Image from "next/image";
import Link from "next/link";
import type { Banner } from "@/lib/types";

/** Promo banners between the home sections: one full width, two (or more) side by side. */
export function PromoBanners({ banners }: { banners: Banner[] }) {
  if (banners.length === 0) return null;
  const single = banners.length === 1;

  return (
    <section className="mx-auto max-w-[100rem] px-3 py-4">
      <div data-reveal-stagger className={`grid gap-4 ${single ? "" : "sm:grid-cols-2"}`}>
        {banners.map((banner) => (
          <Link
            key={banner.id}
            href={banner.button_link || "/products"}
            className={`lift group relative block overflow-hidden rounded-2xl bg-primary hover:shadow-xl ${single ? "aspect-16/5" : "aspect-2/1"}`}
          >
            <Image
              src={banner.image}
              alt={banner.title ?? ""}
              fill
              sizes={single ? "(min-width: 1600px) 1600px, 100vw" : "(min-width: 640px) 50vw, 100vw"}
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
