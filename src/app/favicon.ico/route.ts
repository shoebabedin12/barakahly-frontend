import { getSettings } from "@/lib/queries";

// Resolve per request - a build-time snapshot would bake in the build machine's API URL.
export const dynamic = "force-dynamic";

/**
 * Browsers and crawlers still ask for /favicon.ico directly; send them to the
 * favicon uploaded in Admin -> Settings -> Branding.
 */
export async function GET() {
  const favicon = await getSettings()
    .then((settings) => settings.site_favicon)
    .catch(() => null);

  if (!favicon) return new Response(null, { status: 404 });
  return Response.redirect(favicon, 302);
}
