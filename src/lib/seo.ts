import type { Metadata, MetadataRoute } from "next";

export const SITE_URL = "https://corpentaglobal.in";
export const SITE_NAME = "Corpenta Global";
export const DEFAULT_DESCRIPTION =
  "Explore considered currency and financial markets education from Corpenta Global, grounded in knowledge, discipline and risk awareness.";
export const DEFAULT_OG_IMAGE = "/hero.png";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageAlt?: string;
  index?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  imageWidth = 1837,
  imageHeight = 856,
  imageAlt = "Corpenta Global market education",
  index = true,
}: PageMetadataOptions): Metadata {
  const canonicalPath = path === "/" ? "/" : `/${path.replace(/^\/+|\/+$/g, "")}`;
  const canonicalUrl = new URL(canonicalPath, SITE_URL).toString();
  const imageUrl = new URL(image, SITE_URL).toString();
  const normalizedDescription = description.replace(/\s+/g, " ").trim();
  const seoDescription = normalizedDescription.length <= 160
    ? normalizedDescription
    : `${normalizedDescription.slice(0, 157).replace(/\s+\S*$/, "").trimEnd()}…`;
  const socialTitle = `${title} | ${SITE_NAME}`;
  const robots: Metadata["robots"] = index
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      }
    : { index: false, follow: false, googleBot: { index: false, follow: false } };

  return {
    title,
    description: seoDescription,
    alternates: { canonical: canonicalUrl },
    robots,
    openGraph: {
      type: "website",
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: "en_US",
      title: socialTitle,
      description: seoDescription,
      images: [{ url: imageUrl, width: imageWidth, height: imageHeight, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: seoDescription,
      images: [{ url: imageUrl, alt: imageAlt }],
    },
  };
}

export function jsonLdScript(data: Record<string, unknown> | Array<Record<string, unknown>>) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/logo.png`,
    width: 887,
    height: 790,
  },
  description: DEFAULT_DESCRIPTION,
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  inLanguage: "en",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

export const INDEXABLE_STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
  { url: `${SITE_URL}/founders-desk`, changeFrequency: "monthly", priority: 0.8 },
  { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.5 },
];
