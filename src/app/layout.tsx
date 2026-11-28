import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { PortalChrome } from "@/components/portal-chrome";
import { AsciiMarketEnvironment } from "@/components/ascii-market-environment";
import { VisualReveal } from "@/components/visual-reveal";
import { DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL, jsonLdScript, organizationSchema, websiteSchema } from "@/lib/seo";

const dmSans=localFont({src:"./fonts/dm-sans-latin-wght-normal.woff2",variable:"--font-dm-sans",display:"swap",weight:"100 1000"});
const manrope=localFont({src:"./fonts/manrope-latin-wght-normal.woff2",variable:"--font-manrope",display:"swap",weight:"200 800"});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: { icon: "/logo.png", shortcut: "/logo.png", apple: "/logo.png" },
  title: { default: "Currency Trading Education & Market Learning | Corpenta Global", template: "%s | Corpenta Global" },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    title: "Currency Trading Education & Market Learning | Corpenta Global",
    description: DEFAULT_DESCRIPTION,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1837, height: 856, alt: "Corpenta Global market education" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Currency Trading Education & Market Learning | Corpenta Global",
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const graph = jsonLdScript([organizationSchema, websiteSchema]);
  return <html lang="en" className={`${dmSans.variable} ${manrope.variable}`}><head><link rel="preload" href="/textures/earth-land-mask.png" as="image" fetchPriority="high"/></head><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: graph }}/><AsciiMarketEnvironment/><VisualReveal/><PortalChrome/>{children}</body></html>;
}
