import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
   URL: "http://localhost:8080"
    // URL: "https://server.shikshapay.cloud"

  },
  experimental: {
    optimizePackageImports: [
      'react-icons/md',
      'react-icons/fa',
      'react-icons/fa6',
      'react-icons/pi',
      'react-icons/io5',
      'react-icons/lia',
      'react-icons/ai',
      'react-icons/ri',
      'react-icons/io',
      'react-icons/bs',
      'react-icons/tb',
      'react-icons/ci',
    ],
  },
};

export default nextConfig;

