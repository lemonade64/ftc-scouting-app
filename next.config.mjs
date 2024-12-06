import withSerwistInit from "@serwist/next";
import { createMDX } from "fumadocs-mdx/next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const CSPHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;

const revision = crypto.randomUUID();

const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: CSPHeader.replace(/\n/g, ""),
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Content-Security-Policy",
            value: CSPHeader.replace(/\n/g, ""),
          },
        ],
      },
    ];
  },
};

const withSerwist = withSerwistInit({
  cacheOnNavigation: true,
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  additionalPrecacheEntries: [{ url: "/~offline", revision }],
});

const withMDX = createMDX();

const withBundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withSerwist(withMDX(withBundleAnalyzerConfig(nextConfig)));
