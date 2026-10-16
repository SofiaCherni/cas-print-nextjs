/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // Оптимізовані картинки кешуються на місяць — швидші повторні візити.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Product photos uploaded via /admin are stored on Vercel Blob — its
    // public URLs are subdomains of this pattern.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com"
      }
    ]
  },
  async headers() {
    return [
      {
        // Статика з /public/assets (відео, картинки, лого): тиждень кешу + фонове оновлення.
        source: "/assets/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }]
      }
    ];
  }
};

export default nextConfig;
