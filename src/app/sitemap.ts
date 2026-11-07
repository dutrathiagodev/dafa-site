import type { MetadataRoute } from "next";
import { projects } from "@/content/site";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      images: [`${siteUrl}/media/img/fotografia.webp`],
      videos: projects
        .filter((p) => p.media.type === "video")
        .map((p) => ({
          title: `${p.client} — ${p.services.join(", ")}`,
          description: `${p.segment}. Produção DAFA — Gerenciamento de Conteúdo.`,
          thumbnail_loc:
            p.media.type === "video" ? `${siteUrl}${p.media.poster}` : "",
          content_loc:
            p.media.type === "video" ? `${siteUrl}${p.media.src}` : undefined,
        })),
    },
  ];
}

export const dynamic = "force-static";
