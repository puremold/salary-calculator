import type { MetadataRoute } from "next";
import { PAGE_MANWONS } from "@/lib/salaryData";
import { PAGE_WAGES } from "@/lib/hourlyData";
import { PAGE_MONTHLY_MANWONS } from "@/lib/severanceData";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const yeonbong: MetadataRoute.Sitemap = PAGE_MANWONS.map((m) => ({
    url: `${SITE.url}/yeonbong/${m}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const sigeup: MetadataRoute.Sitemap = PAGE_WAGES.map((w) => ({
    url: `${SITE.url}/sigeup/${w}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const toejikgeum: MetadataRoute.Sitemap = PAGE_MONTHLY_MANWONS.map((m) => ({
    url: `${SITE.url}/toejikgeum/${m}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const hubs: MetadataRoute.Sitemap = ["/sigeup", "/toejikgeum"].map((p) => ({
    url: `${SITE.url}${p}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [
    { url: SITE.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...hubs,
    ...yeonbong,
    ...sigeup,
    ...toejikgeum,
  ];
}
