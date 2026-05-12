import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  /** ngrok-free: some clients respect this on responses; also set on tunnel if issues persist. */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "ngrok-skip-browser-warning", value: "true" }],
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
