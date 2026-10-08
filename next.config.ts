import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // All photography is local (public/images/photos) — no remote hosts needed.
    formats: ["image/webp", "image/avif"],
  },
};

export default nextConfig;
