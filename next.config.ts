import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Enable Fast Refresh
    if (!isServer) {
      config.optimization.moduleIds = 'deterministic';
    }
    return config;
  },
  // Enable hot reloading for images
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
};

export default nextConfig;
