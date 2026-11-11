import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/merch",
        destination: "/shop/merch",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
