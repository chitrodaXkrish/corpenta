import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  poweredByHeader: false,
  trailingSlash: false,
  async redirects() {
    return [{
      source: "/:path*",
      has: [{ type: "host", value: "www.corpentaglobal.in" }],
      destination: "https://corpentaglobal.in/:path*",
      permanent: true,
    }, {
      source: "/:path*",
      has: [
        { type: "host", value: "corpentaglobal.in" },
        { type: "header", key: "x-forwarded-proto", value: "http" },
      ],
      destination: "https://corpentaglobal.in/:path*",
      permanent: true,
    }];
  },
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
