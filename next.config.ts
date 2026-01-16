import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  devIndicators: {
    allowedDevOrigins: ["*.cloudworkstations.dev"],
  },
  images: {
    domains: ["blmmnyiwnqtpsurlfdrw.supabase.co"],
  },
};

export default nextConfig;
