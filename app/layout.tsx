import "./global.css";

import { Analytics } from "@vercel/analytics/react";
import { Poppins } from "next/font/google";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { cookies } from "next/headers";

import { metadata } from "@/app/metadata";
import { siteConfig } from "@/config/site";

import { Toaster } from "sonner";

import Header from "@/components/Header";
import ReloadHandler from "@/components/ReloadHandler";
import { RootProvider } from "fumadocs-ui/provider";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export { metadata };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const checkLocalStorage = cookieStore.get("checkLocalStorage");

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["WebApplication", "SoftwareApplication"],
              name: siteConfig.name.default,
              url: siteConfig.links.url,
              description: siteConfig.description,
              applicationCategory: "UtilitiesApplication",
              applicationSubCategory: "ScoutingApplication",
              creator: {
                "@type": "Person",
                name: siteConfig.creator.name,
                url: siteConfig.creator.links,
              },
              keywords: siteConfig.keywords.join(", "),
              inLanguage: "en-AU",
              operatingSystem: "Any",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: 5,
                ratingCount: 42,
              },
              offers: {
                "@type": "Offer",
                price: 0,
                priceCurrency: "USD",
              },
              icon: "/favicon.ico",
              mainEntityOfPage: siteConfig.links.url,
            }),
          }}
        />
        {checkLocalStorage && (
          <Script strategy="beforeInteractive">
            {`
              if (localStorage.getItem('formSubmissions')) {
                document.cookie = 'hasFormSubmissions=true; path=/';
                window.location.href = '/scout';
              }
            `}
          </Script>
        )}
      </head>
      <body className={poppins.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          themes={["light", "dark", "saffron", "violet"]}
        >
          <Header />
          <RootProvider>{children}</RootProvider>
          <Analytics />
          <SpeedInsights />
          <Toaster richColors position="bottom-center" />
          <ReloadHandler />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
