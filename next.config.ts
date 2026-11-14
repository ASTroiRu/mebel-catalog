import { siteConfig } from "./src/lib/config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: { formats: ["image/avif", "image/webp"], minimumCacheTTL: 14400 },
  turbopack: { root: process.cwd() },
  poweredByHeader: false,
  // Demo-only by default. Changing the central setting requires a release review.
  async headers() {
    return siteConfig.demo ? [{
      source: "/:path*",
      headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
    }] : [];
  },
};

export default nextConfig;
