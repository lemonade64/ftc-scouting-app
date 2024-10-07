import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL("https://ftc-scouting-app.vercel.app/"),
  alternates: {
    canonical: "/",
  },
  title: siteConfig.name.default,
  description: siteConfig.description,
  applicationName: siteConfig.name.default,
  authors: [{ name: siteConfig.creator.name, url: siteConfig.creator.links }],
  creator: siteConfig.creator.name,
  keywords: siteConfig.keywords.join(", "),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: `${siteConfig.links.url}/manifest.webmanifest`,
  openGraph: {
    title: siteConfig.name.default,
    description: siteConfig.description,
    url: `${siteConfig.links.url}/opengraph-image.png`,
    siteName: siteConfig.name.default,
    images: [
      {
        url: `${siteConfig.links.url}/opengraph-image.png`,
        width: 1200,
        height: 630,
      },
    ],
    locale: "en-AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name.default,
    description: siteConfig.description,
    images: [`${siteConfig.links.url}/opengraph-image.png`],
  },
  abstract: siteConfig.description,
  category: "technology",
};
