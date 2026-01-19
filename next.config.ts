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
  // AÑADE ESTA SECCIÓN:
  async rewrites() {
    return [
      {
        source: "/api-backend/:path*",
        destination: "https://frikibox-backend.vercel.app/:path*",
      },
    ];
  },
};

export default nextConfig;