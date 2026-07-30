import type { MetadataRoute } from "next";
import { getApiBaseUrl, getSiteUrl } from "@/config/runtime-config";

export const dynamic = "force-dynamic";

interface SitemapProduct {
  id: string;
  updatedAt?: string;
  updated_at?: string;
}

const STATIC_ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "", changeFrequency: "daily", priority: 1 },
  { path: "/marketplace", changeFrequency: "hourly", priority: 0.9 },
  { path: "/search", changeFrequency: "hourly", priority: 0.8 },
  { path: "/forum", changeFrequency: "hourly", priority: 0.7 },
  { path: "/prices", changeFrequency: "daily", priority: 0.7 },
  { path: "/map", changeFrequency: "weekly", priority: 0.6 },
  { path: "/about", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.4 },
  { path: "/support", changeFrequency: "monthly", priority: 0.4 },
  { path: "/for", changeFrequency: "monthly", priority: 0.4 },
];

async function fetchSitemapProducts(): Promise<SitemapProduct[]> {
  try {
    const qs = new URLSearchParams({
      page: "1",
      limit: "100",
      status: "active",
      sortBy: "createdAt",
      order: "DESC",
    });
    const res = await fetch(`${getApiBaseUrl()}/products?${qs}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const payload = json?.data ?? json;
    return Array.isArray(payload?.data) ? payload.data : [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();
  const staticRoutes = STATIC_ROUTES.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const productRoutes = (await fetchSitemapProducts()).map((product) => ({
    url: `${siteUrl}/products/${product.id}`,
    lastModified: product.updatedAt ?? product.updated_at ?? now,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
