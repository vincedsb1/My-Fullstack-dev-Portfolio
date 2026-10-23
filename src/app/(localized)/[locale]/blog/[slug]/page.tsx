import { RelatedProjects } from "@/features/blog/RelatedProjects";
import JsonArticlePage from "@/features/blog/json/JsonArticlePage";
import { articleLayouts } from "@/features/blog/ArticleLayouts";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { PERSON_ID, WEBSITE_ID } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/site";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleDocument from "../../../../../features/blog/ArticleDocument";
import {
  getArticleReadingTime,
  getPublishedArticle,
  getPublishedArticles,
  getPublishedTranslations,
  type BlogLocale,
} from "@/lib/blog/articles";

const baseUrl = SITE_URL;

function getLocale(value: string): BlogLocale | undefined {
  return value === "fr" || value === "en" ? value : undefined;
}

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedArticles().map((article) => ({
    locale: article.metadata.locale,
    slug: article.metadata.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = getLocale(rawLocale);
  if (!locale) notFound();
  const article = getPublishedArticle(locale, slug);
  if (!article) notFound();

  const { metadata } = article;
  const translations = getPublishedTranslations(metadata.translationKey);
  const languages = Object.fromEntries(
    (translations.length > 0 ? translations : [article]).map((item) => [
      item.metadata.locale,
      `${baseUrl}/${item.metadata.locale}/blog/${item.metadata.slug}`,
    ]),
  );

  return buildPageMetadata({
    locale,
    path: `/${locale}/blog/${slug}`,
    title: metadata.seoTitle ?? metadata.title,
    description: metadata.description,
    type: "article",
    alternates: languages,
    image: `/${locale}/blog/${slug}/social-image`,
    imageAlt: metadata.title,
    publishedTime: `${metadata.publishedAt}T00:00:00.000Z`,
    modifiedTime: metadata.updatedAt
      ? `${metadata.updatedAt}T00:00:00.000Z`
      : undefined,
  });
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = getLocale(rawLocale);
  if (!locale) notFound();
  const article = getPublishedArticle(locale, slug);
  if (!article) notFound();

  const readingMinutes = getArticleReadingTime(article);
  const Layout = articleLayouts[article.metadata.renderer ?? "default"];
  const jsonArticle =
    "format" in article && article.format === "json" ? article.data : null;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.metadata.title,
    description: article.metadata.description,
    image: [`${baseUrl}/${locale}/blog/${slug}/social-image`],
    datePublished: article.metadata.publishedAt,
    ...(article.metadata.updatedAt
      ? { dateModified: article.metadata.updatedAt }
      : {}),
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    isPartOf: { "@id": WEBSITE_ID },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/${locale}/blog/${slug}`,
    },
    inLanguage: locale === "fr" ? "fr-FR" : "en",
  };
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Portfolio",
        item: `${baseUrl}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${baseUrl}/${locale}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.metadata.title,
        item: `${baseUrl}/${locale}/blog/${slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-surface text-content">
      <JsonLd data={structuredData} />
      <JsonLd data={breadcrumbStructuredData} />
      {jsonArticle ? (
        <JsonArticlePage
          article={jsonArticle}
          readingMinutes={readingMinutes}
          related={(jsonArticle.related?.slugs ?? [])
            .map((s) =>
              getPublishedArticles(locale).find((a) => a.metadata.slug === s),
            )
            .filter((a): a is NonNullable<typeof a> => Boolean(a))
            .map((a) => ({ slug: a.metadata.slug, title: a.metadata.title }))}
        />
      ) : (
        <Layout article={article} readingMinutes={readingMinutes}>
          <ArticleDocument article={article} readingMinutes={readingMinutes} />
          <RelatedProjects
            locale={locale}
            slugs={article.metadata.relatedProjects ?? []}
          />
        </Layout>
      )}
    </div>
  );
}
