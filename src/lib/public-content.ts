type PublicCourse = {
  id: string;
  title: string;
  short_description: string | null;
  price: number | null;
  currency: string;
  duration_label: string | null;
};

export type PublicScenario = {
  id: string;
  pair: string;
  direction: "buy" | "sell" | "watching" | null;
  description: string | null;
  commentary: string | null;
  published_at: string;
};

function publicRestUrl(table: string, params: Record<string, string>) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!base || !anonKey) return null;
  const url = new URL(`/rest/v1/${table}`, base);
  url.search = new URLSearchParams(params).toString();
  return { url, anonKey };
}

async function getPublicRows<T>(table: string, params: Record<string, string>): Promise<T[]> {
  const request = publicRestUrl(table, params);
  if (!request) return [];
  try {
    const response = await fetch(request.url, {
      headers: { apikey: request.anonKey, Authorization: `Bearer ${request.anonKey}` },
      next: { revalidate: 300 },
    });
    if (!response.ok) return [];
    const rows = (await response.json()) as unknown;
    return Array.isArray(rows) ? rows as T[] : [];
  } catch {
    return [];
  }
}

export function getPublicCourses() {
  return getPublicRows<PublicCourse>("courses", {
    select: "id,title,short_description,price,currency,duration_label",
    is_published: "eq.true",
    archived_at: "is.null",
    order: "sort_order.asc,created_at.asc",
    limit: "7",
  });
}

export function getPublicScenarios() {
  return getPublicRows<PublicScenario>("market_scenarios", {
    select: "id,pair,direction,description,commentary,published_at",
    visibility: "in.(public,both)",
    published_at: "not.is.null",
    order: "published_at.desc",
    limit: "6",
  });
}

