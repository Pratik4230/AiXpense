import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
  async redirects() {
    return [
      { source: "/blog", destination: "/", permanent: true },
      { source: "/blog/:path*", destination: "/", permanent: true },
    ];
  },
  /** ngrok-free: some clients respect this on responses; also set on tunnel if issues persist. */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "ngrok-skip-browser-warning", value: "true" }],
      },
      {
        source: "/(privacy|terms|refund|shipping|contact)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
      {
        protocol: "https",
        hostname: "api.producthunt.com",
      },
    ],
  },
};

export default nextConfig;
