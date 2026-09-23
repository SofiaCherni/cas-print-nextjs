/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // Product photos uploaded via /admin are stored on Vercel Blob — its
    // public URLs are subdomains of this pattern.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com"
      }
    ]
  }
};

export default nextConfig;
