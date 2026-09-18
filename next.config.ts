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

  images: {
    // Applies to every next/image regardless of source — serves modern
    // formats automatically where the browser supports them.
    formats: ["image/avif", "image/webp"],
    // TODO: once you know the domain your uploaded images/logos/gallery
    // photos are served from (S3/Cloudinary/etc.), add it here so those
    // can move from raw <img> tags to next/image (automatic resizing +
    // the formats above):
    // remotePatterns: [
    //   { protocol: "https", hostname: "your-asset-domain.example.com" },
    // ],
  },

  // Gzip/Brotli-compress responses. Also the default in production, but
  // set explicitly so it can't be silently disabled by a config merge.
  compress: true,

  poweredByHeader: false,
};

export default nextConfig;