import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
 //  URL: "https://erp-backend-p5nc.onrender.com",
   URL : "http://3.88.157.239:8080",
  //  URL: "http://localhost:5070"
  },
    eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
