/* eslint-disable no-undef */

export type BlogLocale = "fr" | "en";
export type BlogArticleStatus = "published" | "draft";
export type BlogArticleRenderer = "guide" | "editorial";

export interface BlogArticleMetadata {
  title: string;
  seoTitle?: string;
  description: string;
  excerpt: string;
  slug: string;
  locale: BlogLocale;
  category: string;
  publishedAt: string;
  updatedAt?: string;
  cover?: string;
  coverAlt?: string;
  status: BlogArticleStatus;
  translationKey?: string;
  relatedProjects?: string[];
  renderer?: BlogArticleRenderer;
}

export interface BlogArticleRecord {
  metadata: BlogArticleMetadata;
  body: string;
  filePath: string;
}

export function readAllBlogArticles(): BlogArticleRecord[];
