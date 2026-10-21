import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAvailableCaseStudy,
  getAvailableProjectSlugs,
  getProjectFromCatalog,
} from "@/content/projects/loaders";
import { getProjectDetailPath } from "@/lib/projects/routes";
import { ProjectCaseStudyRoutePage } from "../../../../components/projects/ProjectCaseStudyRoutePage";
import type { ProjectLocale } from "@/content/projects/types";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://vincent.desbrosses.net";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAvailableProjectSlugs("en").map((slug) => ({
    locale: "en",
    slug,
  }));
}

function getEnglishLocale(value: string): ProjectLocale {
  if (value !== "en") notFound();
  return "en";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = getEnglishLocale(rawLocale);
  const project = getProjectFromCatalog(slug);
  const manifest = getAvailableCaseStudy(locale, slug);
  if (!project || !manifest) notFound();
  const url = `${baseUrl}${getProjectDetailPath(locale, slug)}`;
  const image = manifest.seo.socialImage?.src
    ? `${baseUrl}${manifest.seo.socialImage.src}`
    : `${baseUrl}/pp.jpg`;
  const languages: Record<string, string> = { en: url };
  if (getAvailableCaseStudy("fr", slug)) {
    languages.fr = `${baseUrl}${getProjectDetailPath("fr", slug)}`;
  }
  return {
    title: `${manifest.seo.title} | Vincent DESBROSSES`,
    description: manifest.seo.description,
    robots: manifest.seo.noindex ? { index: false, follow: false } : undefined,
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      title: manifest.seo.title,
      description: manifest.seo.description,
      url,
      siteName: "Vincent DESBROSSES",
      type: "article",
      locale: "en_US",
      images: [
        { url: image, width: 1200, height: 630, alt: manifest.seo.title },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: manifest.seo.title,
      description: manifest.seo.description,
      images: [image],
    },
  };
}

export default async function EnglishProjectCaseStudy({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = getEnglishLocale(rawLocale);
  return <ProjectCaseStudyRoutePage locale={locale} slug={slug} />;
}
