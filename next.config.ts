import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imageproxy.wolt.com",
      },
      // при необходимости добавляешь сюда другие CDN
    ],
  },
};

export default nextConfig;
