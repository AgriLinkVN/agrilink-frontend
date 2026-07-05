import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://agrilink.vn";

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

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
