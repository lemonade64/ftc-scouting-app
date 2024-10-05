import { createMDX } from "fumadocs-mdx/next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig = {};

const withMDX = createMDX();

const withBundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withMDX(withBundleAnalyzerConfig(nextConfig));
