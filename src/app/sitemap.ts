import { MetadataRoute } from "next";
import { getPublishedArticles, type BlogLocale } from "@/lib/blog/articles";
import { getPublishedProjectSlugs } from "@/content/projects/loaders";
import { getArchivePath, getProjectDetailPath } from "@/lib/projects/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://vincent.desbrosses.net";
  const homeLastModified = new Date("2026-10-11T00:00:00.000Z");
  // Keep these dates tied to verified editorial updates, not sitemap generation.

  const articles = getPublishedArticles();
  const publishedLocales = new Set(
    articles.map((article) => article.metadata.locale),
  );
  const translations = new Map<string, Set<BlogLocale>>();
  for (const article of articles) {
    const key = article.metadata.translationKey;
    if (!key) continue;
    const locales = translations.get(key) ?? new Set<BlogLocale>();
    locales.add(article.metadata.locale);
    translations.set(key, locales);
  }
  const hasTranslatedArticles = Array.from(translations.values()).some(
    (locales) => locales.has("fr") && locales.has("en"),
  );
  const blogIndexes = (["fr", "en"] as const)
    .filter((locale) => locale === "fr" || publishedLocales.has(locale))
    .map((locale) => {
      const localeArticles = articles.filter(
        (article) => article.metadata.locale === locale,
      );
      const lastModified = localeArticles
        .map(
          (article) =>
            article.metadata.updatedAt ?? article.metadata.publishedAt,
        )
        .sort()
        .at(-1);
      const url = `${baseUrl}/${locale}/blog`;
      const languages = hasTranslatedArticles
        ? { fr: `${baseUrl}/fr/blog`, en: `${baseUrl}/en/blog` }
        : { [locale]: url };

      return {
        url,
        ...(lastModified
          ? { lastModified: new Date(`${lastModified}T00:00:00.000Z`) }
          : {}),
        changeFrequency: "monthly" as const,
        priority: 0.7,
        alternates: { languages },
      };
    });

  const projectArchives = (["fr", "en"] as const).map((locale) => {
    const url = `${baseUrl}${getArchivePath(locale)}`;
    return {
      url,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: {
        languages: {
          fr: `${baseUrl}${getArchivePath("fr")}`,
          en: `${baseUrl}${getArchivePath("en")}`,
        },
      },
    };
  });

  const projectPages = (["fr", "en"] as const).flatMap((locale) =>
    getPublishedProjectSlugs(locale).map((slug) => {
      const url = `${baseUrl}${getProjectDetailPath(locale, slug)}`;
      const alternateLocale = locale === "fr" ? "en" : "fr";
      const alternateUrl = getPublishedProjectSlugs(alternateLocale).includes(
        slug,
      )
        ? `${baseUrl}${getProjectDetailPath(alternateLocale, slug)}`
        : undefined;
      return {
        url,
        changeFrequency: "yearly" as const,
        priority: 0.8,
        alternates: {
          languages: {
            [locale]: url,
            ...(alternateUrl ? { [alternateLocale]: alternateUrl } : {}),
          },
        },
      };
    }),
  );

  return [
    {
      url: `${baseUrl}/juliedieris`,
      changeFrequency: "yearly",
      priority: 0.8,
    },
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
    ...blogIndexes,
    ...projectArchives,
    ...projectPages,
    ...articles.map((article) => ({
      url: `${baseUrl}/${article.metadata.locale}/blog/${article.metadata.slug}`,
      lastModified: new Date(
        `${
          article.metadata.updatedAt ?? article.metadata.publishedAt
        }T00:00:00.000Z`,
      ),
      changeFrequency: "yearly" as const,
      priority: article.metadata.renderer === "guide" ? 0.8 : 0.7,
      alternates: article.metadata.translationKey
        ? {
            languages: Object.fromEntries(
              articles
                .filter(
                  (translated) =>
                    translated.metadata.translationKey ===
                    article.metadata.translationKey,
                )
                .map((translated) => [
                  translated.metadata.locale,
                  `${baseUrl}/${translated.metadata.locale}/blog/${translated.metadata.slug}`,
                ]),
            ),
          }
        : undefined,
    })),
  ];
}
