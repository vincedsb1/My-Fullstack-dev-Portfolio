import type { JsonBlogArticle } from "./json-types";
import type { BlogArticleMetadata } from "./article-source.mjs";
export type JsonBlogRecord = {
  metadata: BlogArticleMetadata;
  body: string;
  links: string[];
  ids: string[];
  storageKeys: string[];
  filePath: string;
  format: "json";
  data: JsonBlogArticle;
};
export function validateJsonArticle(
  article: unknown,
  opts?: {
    file?: string;
    locale?: string;
    filenameSlug?: string;
    publicRoot?: string;
  },
): {
  article: JsonBlogArticle;
  links: string[];
  ids: string[];
  storageKeys: string[];
};
export function readJsonBlogArticleFile(
  filePath: string,
  opts?: { locale?: string; publicRoot?: string },
): JsonBlogRecord;
export function readAllJsonBlogArticles(opts?: {
  root?: string;
  publicRoot?: string;
}): JsonBlogRecord[];
export function validateMergedBlogArticles<
  T extends {
    metadata: BlogArticleMetadata;
    filePath: string;
    format?: string;
    data?: JsonBlogArticle;
  },
>(records: T[]): T[];
export function getJsonReadingText(article: JsonBlogArticle): string;
export const registeredJsonCustomModules: readonly string[];
