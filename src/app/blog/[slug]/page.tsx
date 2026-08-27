import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api";
import { getBlogPost } from "@/lib/queries";

export default async function BlogShowPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const post = await getBlogPost(slug).catch((err) => {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  });

  if (!post) notFound();

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <nav className="mb-6 text-sm text-dark/40">
        <Link href="/blog" className="hover:text-primary">Blog</Link>
        <span className="mx-1">/</span>
        <span className="text-dark">{post.title}</span>
      </nav>

      {post.featured_image && (
        <div className="mb-6 aspect-video overflow-hidden rounded-2xl bg-background">
          <Image src={post.featured_image} alt={post.title} width={768} height={432} className="h-full w-full object-cover" />
        </div>
      )}

      <p className="text-sm text-dark/40">
        {post.published_at ? new Date(post.published_at).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" }) : ""}
      </p>

      <h1 className="mt-1 text-3xl font-bold text-dark">{post.title}</h1>

      <div
        className="mt-6 space-y-4 text-[15px] leading-relaxed text-dark/80
          [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-dark
          [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-dark
          [&_a]:text-primary [&_a]:underline
          [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6
          [&_img]:my-4 [&_img]:rounded-xl"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.related_posts.length > 0 && (
        <div className="mt-14 border-t border-black/10 pt-10 dark:border-white/10">
          <h2 className="mb-5 text-lg font-bold text-dark">More Articles</h2>

          <div className="grid gap-5 sm:grid-cols-3">
            {post.related_posts.map((related) => (
              <Link key={related.id} href={`/blog/${related.slug}`} className="group block">
                <div className="aspect-video overflow-hidden rounded-xl bg-background">
                  {related.featured_image && (
                    <Image
                      src={related.featured_image}
                      alt={related.title}
                      width={200}
                      height={112}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  )}
                </div>
                <p className="mt-2 text-sm font-medium text-dark transition group-hover:text-primary">{related.title}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
