import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleDocument from "../../../components/blog/ArticleDocument";
import {
  ArticleBreadcrumbs,
  ArticleFooter,
  ArticleHeader,
  BlogSiteNavigation,
} from "../../../components/blog/BlogComponents";
import {
  getArticleReadingTime,
  getPublishedArticle,
  getPublishedArticles,
  getPublishedTranslations,
  type BlogLocale,
} from "@/lib/blog/articles";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://vincent.desbrosses.net";

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
  const url = `${baseUrl}/${metadata.locale}/blog/${metadata.slug}`;
  const socialImage = `${url}/social-image`;
  const translations = getPublishedTranslations(metadata.translationKey);
  const languages = Object.fromEntries(
    (translations.length > 0 ? translations : [article]).map((item) => [
      item.metadata.locale,
      `${baseUrl}/${item.metadata.locale}/blog/${item.metadata.slug}`,
    ]),
  );

  return {
    title: `${metadata.title} | Vincent DESBROSSES`,
    description: metadata.description,
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url,
      siteName: "Vincent DESBROSSES",
      type: "article",
      locale: metadata.locale === "fr" ? "fr_FR" : "en_US",
      publishedTime: `${metadata.publishedAt}T00:00:00.000Z`,
      ...(metadata.updatedAt
        ? { modifiedTime: `${metadata.updatedAt}T00:00:00.000Z` }
        : {}),
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: metadata.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      creator: "@vincedsb",
      images: [{ url: socialImage, alt: metadata.title }],
    },
  };
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
  const isInteractiveGuide = article.metadata.renderer === "guide";
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
    author: {
      "@type": "Person",
      name: "Vincent DESBROSSES",
      url: `${baseUrl}/fr`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/${locale}/blog/${slug}`,
    },
    inLanguage: locale === "fr" ? "fr-FR" : "en",
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      {!isInteractiveGuide ? <BlogSiteNavigation locale={locale} /> : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      {isInteractiveGuide ? (
        <div className="guide-page min-h-screen bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
          <ArticleDocument article={article} readingMinutes={readingMinutes} />
        </div>
      ) : (
        <main className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 sm:py-16">
          <ArticleBreadcrumbs article={article} />
          <article>
            <ArticleHeader article={article} readingMinutes={readingMinutes} />
            <div className="blog-prose">
              <ArticleDocument
                article={article}
                readingMinutes={readingMinutes}
              />
            </div>
            <ArticleFooter article={article} />
          </article>
        </main>
      )}
    </div>
  );
}
