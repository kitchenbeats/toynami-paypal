import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "cdn11.bigcommerce.com",
      "toynamishop.com",
      "vfefvlkvauvbbkiotddi.supabase.co",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn11.bigcommerce.com",
        port: "",
        pathname: "/s-el8tinzl5q/**",
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
