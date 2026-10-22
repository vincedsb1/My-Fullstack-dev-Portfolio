import { buildPageMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/lib/site";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogIndex from "../../../../features/blog/BlogIndex";
import { getPublishedArticles, type BlogLocale } from "@/lib/blog/articles";
import { getBlogIndexSeo } from "@/lib/blog/index-metadata";

const baseUrl = SITE_URL;
function getBlogLocale(value: string): BlogLocale {
  if (value === "fr" || value === "en") return value;
  notFound();
}

function hasPublishedTranslationPair() {
  const translations = new Map<string, Set<BlogLocale>>();
  for (const article of getPublishedArticles()) {
    if (!article.metadata.translationKey) continue;
    const locales =
      translations.get(article.metadata.translationKey) ?? new Set();
    locales.add(article.metadata.locale);
    translations.set(article.metadata.translationKey, locales);
  }
  return Array.from(translations.values()).some(
    (locales) => locales.has("fr") && locales.has("en"),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = getBlogLocale((await params).locale);
  const articles = getPublishedArticles(locale);
  if (locale === "en" && articles.length === 0) notFound();

  const seo = getBlogIndexSeo(articles, locale);
  const url = baseUrl + "/" + locale + "/blog";
  const languages = hasPublishedTranslationPair()
    ? { fr: `${baseUrl}/fr/blog`, en: `${baseUrl}/en/blog` }
    : { [locale]: url };
  return buildPageMetadata({
    locale,
    path: `/${locale}/blog`,
    title: seo.title,
    description: seo.description,
    alternates: languages,
    image: `/${locale}/blog/blog-index-image.png`,
  });
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = getBlogLocale((await params).locale);
  const articles = getPublishedArticles(locale);
  if (locale === "en" && articles.length === 0) notFound();

  const seo = getBlogIndexSeo(articles, locale);
  return <BlogIndex articles={articles} locale={locale} seo={seo} />;
}
