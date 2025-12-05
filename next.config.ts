import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

register: true,
  skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
      // @ts-ignore
      buildExcludes: [/middleware-manifest\.json$/],
}) (nextConfig);
