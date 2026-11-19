import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { AsciiMarketEnvironment } from "@/components/ascii-market-environment";
import { VisualReveal } from "@/components/visual-reveal";
import { DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL, jsonLdScript, organizationSchema, websiteSchema } from "@/lib/seo";

const dmSans=localFont({src:"./fonts/dm-sans-latin-wght-normal.woff2",variable:"--font-dm-sans",display:"swap",weight:"100 1000"});
const manrope=localFont({src:"./fonts/manrope-latin-wght-normal.woff2",variable:"--font-manrope",display:"swap",weight:"200 800"});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Forex Trading Education & Market Learning | Corpenta Global", template: "%s | Corpenta Global" },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    title: "Forex Trading Education & Market Learning | Corpenta Global",
    description: DEFAULT_DESCRIPTION,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1837, height: 856, alt: "Corpenta Global market education" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Forex Trading Education & Market Learning | Corpenta Global",
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const graph = jsonLdScript([organizationSchema, websiteSchema]);
  return <html lang="en" className={`${dmSans.variable} ${manrope.variable}`}><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: graph }}/><AsciiMarketEnvironment/><VisualReveal/><SiteHeader/>{children}<Footer/></body></html>;
}
