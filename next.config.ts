import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Local-only dev database (see src/lib/db.ts). Never used on Vercel.
  serverExternalPackages: ["@electric-sql/pglite"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
