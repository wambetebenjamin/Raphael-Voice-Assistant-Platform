import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Site photos are local, already-compressed 500px assets. Serve them
    // directly instead of waiting for per-request AVIF/WebP transcoding.
    unoptimized: true,
  },
};

export default nextConfig;
