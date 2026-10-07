import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server bundle for the VPS (copied up and run under pm2).
  output: "standalone",
  // Dev-only: let phones on the LAN (and HTTPS tunnels, needed for passkeys)
  // load the dev server's JS. Without this the page renders but never
  // hydrates, so login, cart and the passkey button don't work on mobile.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "*.trycloudflare.com", "*.ngrok-free.app"],
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "127.0.0.1", port: "8000", pathname: "/storage/**" },
      { protocol: "http", hostname: "localhost", port: "8000", pathname: "/storage/**" },
      { protocol: "https", hostname: "barakahly.com", pathname: "/storage/**" },
      { protocol: "https", hostname: "www.barakahly.com", pathname: "/storage/**" },
    ],
    // The API runs on a local/private IP in dev (127.0.0.1). In
    // production this points at a real public domain, so this flag is
    // effectively dev-only.
    dangerouslyAllowLocalIP: true,
  },
  // Proxy the API through this server so the browser only ever talks to the
  // storefront's own origin. Without this, a phone on the LAN (or a tunnel
  // URL) would call http://127.0.0.1:4000 - i.e. the phone itself - and every
  // client-side request (login, cart, passkeys) would fail. In production
  // Nginx routes /api/v1 and /storage itself, so these only matter in dev.
  rewrites() {
    const apiUrl = process.env.INTERNAL_API_URL ?? "http://127.0.0.1:4000";
    // Uploaded images live on disk; in dev point this at anything serving them.
    const storageUrl = process.env.STORAGE_URL ?? "http://127.0.0.1:8000";

    return [
      { source: "/api/v1/:path*", destination: `${apiUrl}/api/v1/:path*` },
      { source: "/storage/:path*", destination: `${storageUrl}/storage/:path*` },
    ];
  },
};

export default nextConfig;
