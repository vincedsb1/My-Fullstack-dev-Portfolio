import "server-only";

import {
  readAllBlogArticles,
  type BlogArticleMetadata,
  type BlogArticleRecord,
  type BlogLocale,
} from "./article-source.mjs";
import { readFileSync } from "node:fs";
import path from "node:path";
const guideContent = readFileSync(
  path.join(process.cwd(), "src/content/guide-reading.txt"),
  "utf8",
);
import { estimateReadingTime } from "./reading-time";

export type { BlogArticleMetadata, BlogArticleRecord, BlogLocale };

let cachedArticles: BlogArticleRecord[] | undefined;
const readCached = () =>
  process.env.NODE_ENV === "development"
    ? readAllBlogArticles()
    : (cachedArticles ??= readAllBlogArticles());

export function getPublishedArticles(locale?: BlogLocale) {
  return readCached()
    .filter(
      (article) =>
        article.metadata.status === "published" &&
        (!locale || article.metadata.locale === locale),
    )
    .sort((left, right) => {
      const byDate = right.metadata.publishedAt.localeCompare(
        left.metadata.publishedAt,
      );
      return byDate || left.metadata.slug.localeCompare(right.metadata.slug);
    });
}

export function getPublishedArticle(locale: BlogLocale, slug: string) {
  return getPublishedArticles(locale).find(
    (article) => article.metadata.slug === slug,
  );
}

export function getPublishedTranslations(translationKey?: string) {
  if (!translationKey) return [];

  return getPublishedArticles().filter(
    (article) => article.metadata.translationKey === translationKey,
  );
}

export function getArticleReadingTime(article: BlogArticleRecord) {
  const source =
    article.metadata.renderer === "guide" ? guideContent : article.body;
  return estimateReadingTime(source);
}

export function getArticleSocialImagePath(
  article: Pick<BlogArticleMetadata, "locale" | "slug">,
) {
  return `/${article.locale}/blog/${article.slug}/social-image`;
}
