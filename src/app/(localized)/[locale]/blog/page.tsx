import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogIndex from "../../../components/blog/BlogIndex";
import { getPublishedArticles, type BlogLocale } from "@/lib/blog/articles";
import { getBlogIndexSeo } from "@/lib/blog/index-metadata";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://vincent.desbrosses.net";
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
  const imageUrl = baseUrl + "/" + locale + "/blog/blog-index-image.png";
  const languages = hasPublishedTranslationPair()
    ? { fr: `${baseUrl}/fr/blog`, en: `${baseUrl}/en/blog` }
    : { [locale]: url };
  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url,
      siteName: "Vincent DESBROSSES",
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: seo.imageAlt,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      creator: "@vincedsb",
      site: "@vincedsb",
      images: [{ url: imageUrl, alt: seo.imageAlt }],
    },
  };
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
