import type { MetadataRoute } from "next";
import { getBuildSafeSiteUrl } from "@/config/runtime-config";

const SITE_URL = getBuildSafeSiteUrl();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/auth/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
