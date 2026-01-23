import type { NextConfig } from "next";

// In Docker Compose, backend service is always at http://backend:3001
// For local dev without Docker, use localhost:3001
const BACKEND_URL = process.env.NODE_ENV === 'production'
  ? 'http://backend:3001'
  : (process.env.BACKEND_INTERNAL_URL || 'http://localhost:3001');

const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployment
  output: 'standalone',

  // Proxy /api/* requests to the backend service
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
