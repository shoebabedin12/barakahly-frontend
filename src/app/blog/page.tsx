import Image from "next/image";
import Link from "next/link";
import { IconNewspaper } from "@/components/icons";
import { getBlogPosts, getSettings } from "@/lib/queries";

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam ?? "1");

  const [posts, settings] = await Promise.all([
    getBlogPosts(page),
    getSettings().catch(() => null),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <h1 className="mb-2 text-3xl font-bold text-dark">Blog</h1>
      <p className="mb-8 text-sm text-dark/50">Stories, tips, and updates from {settings?.site_name ?? "Barakahly"}</p>

      {posts.data.length === 0 ? (
        <div className="rounded-2xl border border-black/10 py-20 text-center dark:border-white/10">
          <IconNewspaper className="mx-auto h-12 w-12 text-dark/20" />
          <p className="mt-3 text-dark/50">No articles published yet. Check back soon.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.data.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block overflow-hidden rounded-2xl border border-black/10 transition hover:shadow-md dark:border-white/10"
              >
                <div className="aspect-video overflow-hidden bg-background">
                  {post.featured_image ? (
                    <Image
                      src={post.featured_image}
                      alt={post.title}
                      width={400}
                      height={225}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-dark/20">
                      <IconNewspaper className="h-10 w-10" />
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <p className="text-xs text-dark/40">
                    {post.published_at ? new Date(post.published_at).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" }) : ""}
                  </p>
                  <h2 className="mt-1 font-bold text-dark transition group-hover:text-primary">{post.title}</h2>
                  {post.excerpt && <p className="mt-2 line-clamp-2 text-sm text-dark/60">{post.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>

          {posts.meta.last_page > 1 && (
            <div className="mt-10 flex items-center justify-center gap-4 text-sm">
              <Link
                href={`/blog?page=${page - 1}`}
                aria-disabled={page <= 1}
                className={`font-medium ${page <= 1 ? "pointer-events-none text-dark/30" : "text-primary hover:underline"}`}
              >
                Previous
              </Link>
              <span className="text-dark/60">
                Page {posts.meta.current_page} of {posts.meta.last_page}
              </span>
              <Link
                href={`/blog?page=${page + 1}`}
                aria-disabled={page >= posts.meta.last_page}
                className={`font-medium ${page >= posts.meta.last_page ? "pointer-events-none text-dark/30" : "text-primary hover:underline"}`}
              >
                Next
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
