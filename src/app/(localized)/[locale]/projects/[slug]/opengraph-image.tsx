import { getAvailableProjectSlugs } from "@/content/projects/loaders";
import { locales } from "@/i18n/routing";
export const dynamic = "force-static";
import { notFound } from "next/navigation";
import { getAvailableCaseStudy } from "@/content/projects/loaders";
import type { Locale } from "@/i18n/routing";
import { createSocialImage } from "@/lib/seo/social-image";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Project case study";
export default async function Image({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const manifest = getAvailableCaseStudy(locale, slug);
  if (!manifest) notFound();
  return createSocialImage({
    category: manifest.meta.category,
    title: manifest.seo.title,
    excerpt: manifest.hero.hook,
  });
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getAvailableProjectSlugs(locale).map((slug) => ({ locale, slug })),
  );
}
