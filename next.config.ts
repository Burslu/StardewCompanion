import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Disable static page generation to avoid SSR context issues
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
};

export default nextConfig;
