import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      allowedOrigins: ["10.6.0.6", "localhost:3000"],
    },
  },
  allowedDevOrigins: ["10.6.0.6", "localhost:3000"],
};

export default nextConfig;
