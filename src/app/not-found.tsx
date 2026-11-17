import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you requested could not be found. Explore Corpenta Global’s market education and course pages.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <main className="page-main wrap"><div className="page-heading"><span className="eyebrow">404 · PAGE NOT FOUND</span><h1>This page is<br/><em>off the map.</em></h1><p>The address may have changed or the page is no longer available.</p><Link className="button button-dark" href="/">Return to Corpenta Global</Link><Link className="underlined-link" href="/courses">Browse academy courses</Link></div></main>;
}
