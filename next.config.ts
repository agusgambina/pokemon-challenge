import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  swcMinify: true,
  experimental: {
    forceSwcTransforms: true, // Force SWC transforms
  },
};

export default nextConfig;
