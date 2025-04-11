import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Optionally, also ignore TypeScript errors
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
