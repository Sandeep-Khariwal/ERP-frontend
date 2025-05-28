import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
   URL: "https://erp-backend-p5nc.onrender.com",
  //  URL: "http://localhost:8080"
  },
    eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
