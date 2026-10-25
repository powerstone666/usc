import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: { root: projectRoot },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 414, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  // IndexNow key file at /<key>.txt (the key lives in an env var, so it cannot be a static file).
  // Files in /public win over this rewrite, so llms-full.txt and friends are unaffected.
  async rewrites() {
    return [{ source: "/:key([A-Za-z0-9-]{8,128}).txt", destination: "/api/indexnow-key?key=:key" }];
  },
  // One address per page: www redirects to the bare domain, which is what every canonical tag uses.
  async redirects() {
    return [{ source: "/:path*", has: [{ type: "host", value: "www.urbanservicecompany.in" }], destination: "https://urbanservicecompany.in/:path*", permanent: true }];
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
