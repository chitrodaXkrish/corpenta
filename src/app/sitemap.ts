import type { MetadataRoute } from "next";
import { INDEXABLE_STATIC_ROUTES, SITE_URL } from "@/lib/seo";
import { getPublicCourses, getPublicScenarios } from "@/lib/public-content";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [courses, scenarios] = await Promise.all([getPublicCourses(), getPublicScenarios()]);
  const courseUrls: MetadataRoute.Sitemap = courses.map((course) => ({
    url: `${SITE_URL}/courses/${course.id}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));
  const conditionalRoutes: MetadataRoute.Sitemap = [];
  if (courses.length) conditionalRoutes.push({ url: `${SITE_URL}/courses`, changeFrequency: "weekly", priority: 0.9 });
  if (scenarios.length) conditionalRoutes.push({ url: `${SITE_URL}/scenarios`, changeFrequency: "weekly", priority: 0.6 });
  return [...INDEXABLE_STATIC_ROUTES, ...conditionalRoutes, ...courseUrls];
}
