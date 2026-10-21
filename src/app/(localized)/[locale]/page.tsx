import type { Metadata } from "next";

import HomeContent from "./HomeContent.tsx";
import {
  getArticleReadingTime,
  getArticleSocialImagePath,
  getPublishedArticles,
} from "@/lib/blog/articles";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://vincent.desbrosses.net";

  // Only `alternates` is overridden here. Page-level metadata REPLACES the
  // parent object rather than deep-merging it, so redeclaring a partial
  // `openGraph` would drop og:image, og:type, og:site_name and og:locale.
  return {
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        en: `${baseUrl}/en`,
        fr: `${baseUrl}/fr`,
        "x-default": `${baseUrl}/en`,
      },
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale === "en" ? "en" : "fr";
  const localizedArticles = getPublishedArticles(locale);
  const blogArticles = (
    localizedArticles.length > 0
      ? localizedArticles
      : getPublishedArticles("fr")
  )
    .slice(0, 4)
    .map((article) => ({
      locale: article.metadata.locale,
      slug: article.metadata.slug,
      title: article.metadata.title,
      excerpt: article.metadata.excerpt,
      category: article.metadata.category,
      publishedAt: article.metadata.publishedAt,
      image:
        article.metadata.cover ?? getArticleSocialImagePath(article.metadata),
      readingMinutes: getArticleReadingTime(article),
    }));

  return <HomeContent blogArticles={blogArticles} />;
}
