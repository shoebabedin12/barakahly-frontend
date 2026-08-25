import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "127.0.0.1", port: "8000", pathname: "/storage/**" },
      { protocol: "http", hostname: "localhost", port: "8000", pathname: "/storage/**" },
    ],
    // The Laravel API runs on a local/private IP in dev (127.0.0.1). In
    // production this points at a real public domain, so this flag is
    // effectively dev-only.
    dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;
