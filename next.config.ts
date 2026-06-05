import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  // Prisma requires these output file traces to be excluded
  serverExternalPackages: ['@prisma/client', 'prisma'],
};

export default nextConfig;
