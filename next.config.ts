import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ─── Turbopack compatibility ───
  turbopack: {},

  // ─── Compression ───
  compress: true,

  // ─── Power Headers for Performance ───
  headers: async () => [
    {
      // All static assets: aggressive cache
      source: "/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico|woff2|woff|ttf|css|js)",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
    {
      // Security headers for all pages
      source: "/:path*",
      headers: [
        { key: "X-DNS-Prefetch-Control", value: "on" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "X-XSS-Protection", value: "1; mode=block" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
      ],
    },
  ],

  // ─── Image Optimization ───
  images: {
    remotePatterns: [
      // AWS S3 bucket (production image storage)
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
      },
    ],
    // Modern formats for smaller file sizes
    formats: ["image/avif", "image/webp"],
    // Cache optimized images for 30 days
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Responsive breakpoints
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // ─── Increase body size limit for image uploads ───
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },

  // ─── Production optimizations ───
  poweredByHeader: false, // Remove X-Powered-By header
  reactStrictMode: true,
};

// Dynamically add CloudFront/CDN domain if configured
const cdnUrl = process.env.AWS_S3_CDN_URL;
if (cdnUrl) {
  try {
    const url = new URL(cdnUrl);
    nextConfig.images!.remotePatterns!.push({
      protocol: url.protocol.replace(":", "") as "https" | "http",
      hostname: url.hostname,
    });
  } catch {
    // Invalid CDN URL — skip
  }
}

export default nextConfig;
