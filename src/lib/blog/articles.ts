import "server-only";

import {
  readAllBlogArticles,
  type BlogArticleMetadata,
  type BlogArticleRecord,
  type BlogLocale,
} from "./article-source.mjs";
import { guideContent } from "../../app/guide-premier-emploi-developpeur/guideContent";
import { estimateReadingTime } from "./reading-time";

export type { BlogArticleMetadata, BlogArticleRecord, BlogLocale };

export function getPublishedArticles(locale?: BlogLocale) {
  return readAllBlogArticles()
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
