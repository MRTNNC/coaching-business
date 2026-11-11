import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...["/login", "/portal/:path*", "/admin/:path*", "/auth/:path*"].map(
        (source) => ({ source, destination: "/", permanent: true }),
      ),
      {
        source: "/merch",
        destination: "/shop/merch",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
