import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/menu/", priority: 0.9 },
    { path: "/events/", priority: 0.7 },
    { path: "/partner/", priority: 0.6 },
    { path: "/track/", priority: 0.4 },
  ];
  return pages.map((p) => ({ url: `${SITE_URL}${p.path}`, changeFrequency: "weekly", priority: p.priority }));
}
