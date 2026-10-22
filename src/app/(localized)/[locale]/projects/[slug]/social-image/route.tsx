import { notFound } from "next/navigation";
import { locales, type Locale } from "@/i18n/routing";
import {
  getAvailableCaseStudy,
  getAvailableProjectSlugs,
} from "@/content/projects/loaders";
import { createSocialImage } from "@/lib/seo/social-image";
export const dynamic = "force-static";
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getAvailableProjectSlugs(locale).map((slug) => ({ locale, slug })),
  );
}
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string; slug: string }> },
) {
  const { locale: rawLocale, slug } = await params;
  if (!locales.includes(rawLocale as Locale)) notFound();
  const locale = rawLocale as Locale;
  const manifest = getAvailableCaseStudy(locale, slug);
  if (!manifest) notFound();
  return createSocialImage({
    category: manifest.meta.category,
    title: manifest.seo.title,
    excerpt: manifest.hero.hook,
  });
}
