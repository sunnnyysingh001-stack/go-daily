import type { MetadataRoute } from "next";
import { siteOrigin } from "../lib/site-pages";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/account", "/auth/", "/login"],
    },
    sitemap: siteOrigin + "/sitemap.xml",
  };
}
