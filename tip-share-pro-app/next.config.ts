import type { NextConfig } from "next";

// In Docker, backend service is at http://backend:3001 (set as build arg or env var)
// For local dev, defaults to localhost:3001
const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || 'http://backend:3001';

const nextConfig: NextConfig = {
  output: 'standalone',

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND_URL}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
