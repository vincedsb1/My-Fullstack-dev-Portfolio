import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogIndex from "../../components/blog/BlogIndex";
import { getPublishedArticles, type BlogLocale } from "@/lib/blog/articles";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://vincent.desbrosses.net";
const descriptions = {
  en: "Practical notes on web development, software architecture, artificial intelligence, and building digital products.",
  fr: "Retours d’expérience et réflexions autour du développement web, de l’architecture logicielle, de l’intelligence artificielle et de la création de produits numériques.",
};

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

const siteName = "Vincent DESBROSSES";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = getBlogLocale((await params).locale);
  const articles = getPublishedArticles(locale);
  if (locale === "en" && articles.length === 0) notFound();

  const url = `${baseUrl}/${locale}/blog`;
  const description = descriptions[locale];
  const languages = hasPublishedTranslationPair()
    ? { fr: `${baseUrl}/fr/blog`, en: `${baseUrl}/en/blog` }
    : { [locale]: url };
  return {
    title: `Blog | ${siteName}`,
    description,
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      title: "Blog | Vincent DESBROSSES",
      description,
      url,
      siteName: "Vincent DESBROSSES",
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_US",
    },
    twitter: {
      card: "summary",
      title: "Blog | Vincent DESBROSSES",
      description,
      creator: "@vincedsb",
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

  return <BlogIndex articles={articles} locale={locale} />;
}
