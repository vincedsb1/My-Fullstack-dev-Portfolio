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
  return getAvailableProjectSlugs("fr").map((slug) => ({
    locale: "fr",
    slug,
  }));
}

function getFrenchLocale(value: string): ProjectLocale {
  if (value !== "fr") notFound();
  return "fr";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = getFrenchLocale(rawLocale);
  const project = getProjectFromCatalog(slug);
  const manifest = getAvailableCaseStudy(locale, slug);
  if (!project || !manifest) notFound();
  const url = `${baseUrl}${getProjectDetailPath(locale, slug)}`;
  const image = manifest.seo.socialImage?.src
    ? `${baseUrl}${manifest.seo.socialImage.src}`
    : `${baseUrl}/pp.jpg`;
  const languages: Record<string, string> = { fr: url };
  if (getAvailableCaseStudy("en", slug)) {
    languages.en = `${baseUrl}${getProjectDetailPath("en", slug)}`;
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
      locale: "fr_FR",
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

export default async function FrenchProjectCaseStudy({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = getFrenchLocale(rawLocale);
  return <ProjectCaseStudyRoutePage locale={locale} slug={slug} />;
}
