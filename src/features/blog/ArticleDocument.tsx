import { getTranslations } from "next-intl/server";
import type { BlogArticleRecord } from "@/lib/blog/articles";
import { formatBlogDate } from "./BlogComponents";
import { mdxComponents } from "./MdxComponents";
import GuideInteractive from "../guide/GuideInteractive";

async function renderGuide(article: BlogArticleRecord, readingMinutes: number) {
  const { GuideArticle } = await import(
    `@/content/blog/${article.metadata.locale}/${article.metadata.slug}.mdx`
  );
  const { metadata } = article;
  const t = await getTranslations({
    locale: metadata.locale,
    namespace: "blog",
  });
  const templateValues: Record<string, string> = {
    ARTICLE_BREADCRUMB_ARIA: t("breadcrumb"),
    ARTICLE_HOME_URL: `/${metadata.locale}`,
    ARTICLE_BLOG_URL: `/${metadata.locale}/blog`,
    ARTICLE_TITLE: metadata.title,
    ARTICLE_EXCERPT: metadata.excerpt,
    ARTICLE_CATEGORY: metadata.category,
    ARTICLE_PUBLISHED_AT: formatBlogDate(metadata.publishedAt, metadata.locale),
    ARTICLE_PUBLISHED_ISO: metadata.publishedAt,
    ARTICLE_UPDATED_AT: formatBlogDate(
      metadata.updatedAt ?? metadata.publishedAt,
      metadata.locale,
    ),
    ARTICLE_UPDATED_ISO: metadata.updatedAt ?? metadata.publishedAt,
    ARTICLE_UPDATED_CLASS:
      metadata.updatedAt && metadata.updatedAt !== metadata.publishedAt
        ? ""
        : "hidden",
    ARTICLE_READING_TIME: String(readingMinutes),
  };
  return (
    <GuideInteractive>
      <GuideArticle values={templateValues} />
    </GuideInteractive>
  );
}

export default async function ArticleDocument({
  article,
  readingMinutes,
}: {
  article: BlogArticleRecord;
  readingMinutes: number;
}) {
  if (article.metadata.renderer === "guide") {
    return renderGuide(article, readingMinutes);
  }

  const { default: Content } = await import(
    `@/content/blog/${article.metadata.locale}/${article.metadata.slug}.mdx`
  );

  return <Content components={mdxComponents} />;
}
