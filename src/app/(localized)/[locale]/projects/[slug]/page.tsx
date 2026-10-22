import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { locales, type Locale } from "@/i18n/routing";
import {
  getAvailableCaseStudy,
  getAvailableProjectSlugs,
} from "@/content/projects/loaders";
import { getProjectDetailPath } from "@/lib/projects/routes";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { ProjectCaseStudyRoutePage } from "@/features/projects/ProjectCaseStudyRoutePage";
export const dynamic = "force-static";
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getAvailableProjectSlugs(locale).map((slug) => ({ locale, slug })),
  );
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const manifest = getAvailableCaseStudy(locale, slug);
  if (!manifest) notFound();
  return buildPageMetadata({
    locale,
    path: getProjectDetailPath(locale, slug),
    title: manifest.seo.title,
    description: manifest.seo.description,
    type: "article",
    noindex: manifest.seo.noindex,
    alternates: Object.fromEntries(
      locales
        .filter((l) => getAvailableCaseStudy(l, slug))
        .map((l) => [l, getProjectDetailPath(l, slug)]),
    ),
  });
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  return <ProjectCaseStudyRoutePage locale={locale} slug={slug} />;
}
