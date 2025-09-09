import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Add SEO and security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options", 
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
  // Add redirects for SEO
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ];
  },
  // Image optimization for better performance
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  // Compress responses
  compress: true,
};

export default nextConfig;