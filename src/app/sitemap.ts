import type { MetadataRoute } from "next";
import { PAGE_MANWONS } from "@/lib/salaryData";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = PAGE_MANWONS.map((m) => ({
    url: `${SITE.url}/yeonbong/${m}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: SITE.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...pages,
  ];
}
