import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://vincent.desbrosses.net";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/integration"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
