import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  // Keep development Webpack output separate from production builds so running
  // `next build` cannot replace chunks used by an active `next dev` server.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  poweredByHeader: false,
  trailingSlash: false,
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
      ],
    }];
  },
};
export default nextConfig;
