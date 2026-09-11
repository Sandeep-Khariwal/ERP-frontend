import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    //  URL: "http://localhost:8080"
    URL: "https://server.shikshapay.cloud",
  },

  // Automatically tree-shakes barrel-style imports from these packages so
  // `import { IconX } from "@tabler/icons-react"` (and similarly for
  // lucide-react / react-icons) only pulls in the icons actually used,
  // instead of the whole package touching the bundle graph. Safe — no
  // code changes required elsewhere.
  experimental: {
    optimizePackageImports: [
      "@tabler/icons-react",
      "lucide-react",
      "react-icons",
      "@mantine/core",
      "@mantine/hooks",
    ],
  },

  // TODO: once you know the domain your uploaded images/logos/gallery
  // photos are served from (S3/Cloudinary/etc.), add it here so those can
  // move from raw <img> tags to next/image (automatic AVIF/WebP + resizing):
  // images: {
  //   remotePatterns: [
  //     { protocol: "https", hostname: "your-asset-domain.example.com" },
  //   ],
  // },

  poweredByHeader: false,
};

export default nextConfig;