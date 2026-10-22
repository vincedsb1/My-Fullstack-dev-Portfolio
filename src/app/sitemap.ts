import type { MetadataRoute } from "next";
import { getPublishedArticles } from "@/lib/blog/articles";
import {
  getArchiveProjects,
  getPublishedProjectSlugs,
  getPublishedCaseStudy,
} from "@/content/projects/loaders";
import {
  getArchivePath,
  getProjectDetailPath,
  getProjectsPath,
} from "@/lib/projects/routes";
import { absoluteUrl } from "@/lib/site";
import dates from "@/content/site-updates.json";
import type { Locale } from "@/i18n/routing";
export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getPublishedArticles();
  const locales = ["fr", "en"] as const;
  const projectDates = locales.flatMap((l) =>
    getPublishedProjectSlugs(l).map(
      (s) => getPublishedCaseStudy(l, s)!.updatedAt,
    ),
  );
  const archiveDate = getArchiveProjects()
    .flatMap((p) => Object.values(p.links).map((l) => l?.lastCheckedAt ?? ""))
    .sort()
    .at(-1)!;
  const contentDate = [
    dates.home,
    ...projectDates,
    ...articles.map((a) => a.metadata.updatedAt ?? a.metadata.publishedAt),
  ]
    .sort()
    .at(-1)!;
  const entry = (
    path: string,
    date: string,
    alternates: Partial<Record<Locale, string>>,
  ): MetadataRoute.Sitemap[number] => {
    const languages = Object.fromEntries(
      Object.entries(alternates).map(([l, p]) => [l, absoluteUrl(p)]),
    );
    languages["x-default"] = languages.en ?? languages.fr;
    return {
      url: absoluteUrl(path),
      lastModified: new Date(`${date}T00:00:00.000Z`),
      alternates: { languages },
    };
  };
  return [
    {
      url: absoluteUrl("/juliedieris"),
      lastModified: new Date(`${dates.juliedieris}T00:00:00.000Z`),
    },
    ...locales.flatMap((locale) => [
      entry(`/${locale}`, contentDate, { fr: "/fr", en: "/en" }),
      entry(getProjectsPath(locale), projectDates.sort().at(-1)!, {
        fr: getProjectsPath("fr"),
        en: getProjectsPath("en"),
      }),
      entry(getArchivePath(locale), archiveDate, {
        fr: getArchivePath("fr"),
        en: getArchivePath("en"),
      }),
      ...getPublishedProjectSlugs(locale).map((slug) =>
        entry(
          getProjectDetailPath(locale, slug),
          getPublishedCaseStudy(locale, slug)!.updatedAt,
          Object.fromEntries(
            locales
              .filter((l) => getPublishedCaseStudy(l, slug))
              .map((l) => [l, getProjectDetailPath(l, slug)]),
          ),
        ),
      ),
    ]),
    ...locales
      .filter((l) => articles.some((a) => a.metadata.locale === l))
      .map((locale) =>
        entry(
          `/${locale}/blog`,
          articles
            .filter((a) => a.metadata.locale === locale)
            .map((a) => a.metadata.updatedAt ?? a.metadata.publishedAt)
            .sort()
            .at(-1)!,
          Object.fromEntries(
            locales
              .filter((l) => articles.some((a) => a.metadata.locale === l))
              .map((l) => [l, `/${l}/blog`]),
          ),
        ),
      ),
    ...articles.map((article) =>
      entry(
        `/${article.metadata.locale}/blog/${article.metadata.slug}`,
        article.metadata.updatedAt ?? article.metadata.publishedAt,
        Object.fromEntries(
          articles
            .filter(
              (a) =>
                a === article ||
                (article.metadata.translationKey &&
                  a.metadata.translationKey ===
                    article.metadata.translationKey),
            )
            .map((a) => [
              a.metadata.locale,
              `/${a.metadata.locale}/blog/${a.metadata.slug}`,
            ]),
        ),
      ),
    ),
  ];
}
