import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      "cdn11.bigcommerce.com",
      "toynamishop.com",
      "vfefvlkvauvbbkiotddi.supabase.co",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "toynamishop.com",
        port: "",
        pathname: "/product_images/**",
      },
      {
        protocol: "https",
        hostname: "www.toynamishop.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.toynami.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
