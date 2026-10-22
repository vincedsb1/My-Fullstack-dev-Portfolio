import 'server-only';

import {
  readAllBlogArticles,
  type BlogArticleMetadata,
  type BlogArticleRecord as LegacyBlogRecord,
  type BlogLocale,
} from './article-source.mjs';
import {
  readAllJsonBlogArticles,
  validateMergedBlogArticles,
  getJsonReadingText,
  type JsonBlogRecord,
} from './json-source.mjs';
import { guideContent } from '../../app/guide-premier-emploi-developpeur/guideContent';
import { estimateReadingTime } from './reading-time';

export type {BlogArticleMetadata,BlogLocale};
export type BlogArticleRecord = LegacyBlogRecord | JsonBlogRecord;

function getAllArticles():BlogArticleRecord[] {
  return validateMergedBlogArticles([...readAllBlogArticles(), ...readAllJsonBlogArticles()]);
}
export function getPublishedArticles(locale?:BlogLocale) {
  return getAllArticles()
    .filter(article=>article.metadata.status==='published' && (!locale||article.metadata.locale===locale))
    .sort((a,b)=>b.metadata.publishedAt.localeCompare(a.metadata.publishedAt)||a.metadata.slug.localeCompare(b.metadata.slug));
}
export function getPublishedArticle(locale:BlogLocale,slug:string) {
  return getPublishedArticles(locale).find(article=>article.metadata.slug===slug);
}
export function getPublishedTranslations(translationKey?:string) {
  if(!translationKey)return [];
  return getPublishedArticles().filter(article=>article.metadata.translationKey===translationKey);
}
export function getArticleReadingTime(article:BlogArticleRecord) {
  const source = 'format' in article && article.format==='json'
    ? getJsonReadingText(article.data)
    : article.metadata.renderer==='guide' ? guideContent : article.body;
  return estimateReadingTime(source);
}
export function getArticleSocialImagePath(article:Pick<BlogArticleMetadata,'locale'|'slug'>) {
  return `/${article.locale}/blog/${article.slug}/social-image`;
}
