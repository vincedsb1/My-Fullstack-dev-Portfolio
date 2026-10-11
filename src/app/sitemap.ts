import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://vincent.desbrosses.net";
  const homeLastModified = new Date("2026-10-11T00:00:00.000Z");
  const guideLastModified = new Date("2026-10-11T00:00:00.000Z");

  // Keep these dates tied to verified editorial updates, not sitemap generation.

  return [
    {
      url: `${baseUrl}/en`,
      lastModified: homeLastModified,
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          fr: `${baseUrl}/fr`,
          "x-default": `${baseUrl}/en`,
        },
      },
    },
    {
      url: `${baseUrl}/fr`,
      lastModified: homeLastModified,
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          fr: `${baseUrl}/fr`,
          en: `${baseUrl}/en`,
          "x-default": `${baseUrl}/en`,
        },
      },
    },
    {
      url: `${baseUrl}/guide-premier-emploi-developpeur`,
      lastModified: guideLastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
